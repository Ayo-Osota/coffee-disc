export default function handler(req, res) {
    console.log({ req, res });
    const query = req.query.breed;
    res.status(200).json({ message: `I love ${query}` });
  }