const { fetchCoffeeStores } = require("@/lib/coffee-stores");

const getCoffeeStoresByLocation = async (req, res) => {
    try {
        const { latLong, limit } = req.query;
        const response = await fetchCoffeeStores(latLong, limit);
        res.status(200);
        res.json(response);
    } catch (error) {
        console.error("There is an error", error);
        res.status(500);
        res.json({message: "something went wrong"})
    }

}

export default getCoffeeStoresByLocation;