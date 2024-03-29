import { findRecordByFilter, getMinifiedRecords, table } from '@/lib/airtable';



const createCoffeeStore = async (req, res) => {
    if (req.method === 'POST') {
        const { id, name, neighbourhood, address, imgUrl, voting } = req.body;

        try {
            if (id) {
                const records = await findRecordByFilter(id);
                if (records.length !== 0) {
                    res.json(records);
                } else {
                    if (name) {
                        const createRecords = await table.create([
                            {
                                fields: {
                                    id,
                                    name,
                                    address,
                                    neighbourhood,
                                    voting,
                                    imgUrl
                                }
                            }
                        ])
                        const records = getMinifiedRecords(createRecords)
                        res.json(records);
                    } else {
                        res.status(400);
                        res.json({ message: "id or name does not exist" });
                    }

                }
            } else {
                res.status(400);
                res.json({ message: "id is missing" });
            }
        } catch (error) {
            console.error("Error creating or finding a store", err);
            res.status(500);
            res.json({ message: "Error creating or finding a store", err });
        }
    }
}

export default createCoffeeStore;