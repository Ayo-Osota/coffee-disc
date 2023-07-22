const getUrlForCoffeeStores = (latLong, query, limit) => {
    return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${latLong}&limit=${limit}`
}

export const fetchCoffeeStores = async (latLong = "6.662618941353261%2C3.2605952135379233", limit = "6") => {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY
        }
    };

    const response = await fetch(getUrlForCoffeeStores(latLong, "coffee", limit), options)
    const data = await response.json()
    return data.results
    // .catch(err => console.error(err));
}