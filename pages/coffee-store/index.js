import { useRouter } from "next/router";

const CoffeeStore = () => {
    const router = useRouter();

    return(
        <div className="-container">coffee store {router.query.id}</div>
    )
}

export default CoffeeStore;