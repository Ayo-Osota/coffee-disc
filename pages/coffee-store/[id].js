import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import { fetchCoffeeStores } from "@/lib/coffee-stores";
import { useContext, useEffect, useState } from "react";
import { isEmpty, fetcher } from "@/utils";
import { StoreContext } from "@/store/store-context";
import useSWR  from "swr";

export const getStaticProps = async (staticProps) => {
    const params = staticProps.params

    const coffeeStores = await fetchCoffeeStores();

    const findCoffeeStoreById = coffeeStores.find((coffeeStore) => {
        return coffeeStore.fsq_id.toString() === params.id
    });

    return (
        {
            props: {
                coffeeStore: findCoffeeStoreById ? findCoffeeStoreById : { location: [] }
            }
        }
    )
}

export const getStaticPaths = async () => {
    const coffeeStores = await fetchCoffeeStores();

    const paths = coffeeStores.map((coffeeStore) => {
        return {
            params: {
                id: coffeeStore.fsq_id.toString(),
            }
        }
    })

    return {
        paths,
        fallback: true,
    }
}

const CoffeeStore = (initialProps) => {
    const router = useRouter();
    

    const id = router.query.id;

    const [coffeeStore, setCoffeeStore] = useState(initialProps.coffeeStore || {});

    const {
        state: { coffeeStores },
    } = useContext(StoreContext);

    const handleCreateCoffeeStore = async (coffeeStore) => {
        try {
            const {
                id, name, voting, imgUrl, address, neighbourhood
            } = coffeeStore
            const response = await fetch("/api/createCoffeeStore", {
                method: 'POST',
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({
                    id,
                    name,
                    voting: 0,
                    imgUrl,
                    address: address || "404 avenue",
                    neighbourhood: neighbourhood || "Unknown"
                })
            });

            const dbCoffeeStore = response.json();
            console.log({ dbCoffeeStore });
        } catch (error) {
            console.error("Error creating coffee store", err)
        }
    }

    useEffect(() => {
        if (isEmpty(initialProps.coffeeStore)) {
            if (coffeeStores.length > 0) {
                const coffeeStoreFromContext = coffeeStores.find((coffeeStore) => {
                    return coffeeStore.fsq_id.toString() === id
                });

                if (coffeeStoreFromContext) {
                    setCoffeeStore(coffeeStoreFromContext);
                    handleCreateCoffeeStore(coffeeStoreFromContext);
                }
            }
        } else {
            handleCreateCoffeeStore(initialProps.coffeeStore);
        }
    }, [id, initialProps, initialProps.coffeeStore]);

    const { name, location, imgUrl, neighbourhood } = coffeeStore;

    const [votingCount, setVotingCount] = useState(0);

    const {data, error} = useSWR(`/api/getCoffeeStoreById?id=${id}`, fetcher);

    useEffect(() => {
        if(data && data.length > 0) {
            console.log("data with SWR", data);
            setCoffeeStore(data[0]);

            setVotingCount(data[0].voting)
        }
    }, [data]);

    if (router.isFallback) {
        return (
            <div>loading...</div>
        )
    }

    const handleUpvoteButton = async () => {
        try {
            const response = await fetch("/api/favouriteCoffeeStoreById", {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                id,
              }),
            });
      
            const dbCoffeeStore = await response.json();
            console.log(dbCoffeeStore);
      
            if (dbCoffeeStore && dbCoffeeStore.length > 0) {
              let count = votingCount + 1;
              setVotingCount(count);
            }
          } catch (err) {
            console.error("Error upvoting the coffee store", err);
          }
    };

    if (error) {
        return <div>Something went wrong retrieving coffee store</div>
    }

    return (
        <div className="-container">
            <Head>
                <title>
                    {name}
                </title>
            </Head>
            <Link href="/">Back to home</Link>
            <p>{name || "unknown"}</p>
            <div className="grid grid-flow-col grid-cols-2">
                <Image
                    src={imgUrl ||
                        "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
                    }
                    alt={name}
                    width={600}
                    height={360} />

                <div className="">
                    <p>{location.address}</p>
                    <p>{location.region}</p>
                    <div>
                        <p>{votingCount}</p>
                        <button type="button" onClick={handleUpvoteButton}>Vote</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CoffeeStore;