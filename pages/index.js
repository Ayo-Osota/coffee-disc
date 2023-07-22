import Image from 'next/image'
import Head from 'next/head'
import Banner from '@/components/banner'
import { useContext, useEffect, useState } from 'react'
import Card from '@/components/card';
import { fetchCoffeeStores } from '@/lib/coffee-stores';
import useTrackLocation from '@/hooks/use-track-location';
import { ACTION_TYPES, StoreContext } from '@/store/store-context';

export const getStaticProps = async (context) => {
  const coffeeStores = await fetchCoffeeStores();

  return (
    {
      props: {
        coffeeStores,
      }
    }
  )
}

export default function Home(props) {
  // const [coffeeStores, setCoffeeStores] = useState('');
  const [coffeeStoresError, setCoffeeStoresError] = useState(null);
  console.log("props,", props);

  const {dispatch, state} = useContext(StoreContext)
  const {coffeeStores, latLong} = state;

  const { handleTrackLocation, locationErrorMessage, isFindingLocation } = useTrackLocation();

  useEffect(() => {
    async function setCoffeeStoresByLocation() {
      if (latLong) {
        try {
          const response = await fetch(`/api/getCoffeeStoresByLocation?latlong=${latLong}&limit=30`);
          const coffeeStores = await response.json();
          console.log({ coffeeStores });
          // setCoffeeStores(fetchedCoffeeStores)
          dispatch({
            type: ACTION_TYPES.SET_COFFEE_STORES,
            payload: {
              coffeeStores
              }
          })
          //set coffee stores
          setCoffeeStoresError("");
        } catch (error) {
          //set error
          console.error({ error });
          setCoffeeStoresError(error.message);
        }
      }
    }
    setCoffeeStoresByLocation();
  }, [dispatch, latLong]);

  const bannerButtonHandler = () => {
    handleTrackLocation();
  }

  return (
    <div>
      <Head>
        <title>
          Coffee Connoisseur
          <meta
          name="description"
          content="allows you to discover coffee stores"
        />
        </title>
      </Head>
      <main>
        <Banner buttonText={isFindingLocation ? "Locating..." : "View shops nearby"} buttonHandler={bannerButtonHandler} />
        {locationErrorMessage && <p className='-container text-4xl font-semibold mt-32 mb-8'>Something went wrong: {locationErrorMessage}</p>}
        {coffeeStoresError && <p className='-container text-4xl font-semibold mt-32 mb-8'>Something went wrong: {coffeeStoresError}</p>}
        
        {coffeeStores.length > 0 && (<div><h2 className='-container text-4xl font-semibold mt-32 mb-8'>Coffee Stores near you</h2>
          <div className='-container grid grid-cols-3 justify-between gap-6'>
            {coffeeStores.map((coffeeStore) => {
              return (
                <Card
                  key={coffeeStore.fsq_id}
                  name={coffeeStore.name}
                  imgUrl={
                    coffeeStore.imgUrl ||
                    "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
                  }
                  href={`/coffee-store/${coffeeStore.fsq_id}`} />
              )
            })}
          </div></div>)}
        
        {props.coffeeStores.length > 0 && <h2 className='-container text-4xl font-semibold mt-32 mb-8'>Ibadan Coffee Stores</h2>}
        {/* <Image src="https://icons8.com/mega-creator/new?template=617294ba465ada00ce3d0b89" alt="" width={250} height={250}/> */}
        <div className='-container grid grid-flow-col grid-rows-2 grid-cols-3 justify-between gap-6'>
          {props.coffeeStores.map((coffeeStore) => {
            return (
              <Card
                key={coffeeStore.fsq_id}
                name={coffeeStore.name}
                imgUrl={
                  coffeeStore.imgUrl ||
                  "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
                }
                href={`/coffee-store/${coffeeStore.fsq_id}`} />
            )
          })}
        </div>

        
      </main>
    </div>
  )
}
