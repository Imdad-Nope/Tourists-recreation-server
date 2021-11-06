const express = require('express')
const cors = require('cors');
require('dotenv').config()
const { MongoClient } = require('mongodb');
const ObjectId = require("mongodb").ObjectId;


const app = express()
const port = process.env.PORT || 5000

// Middle ware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.n5vc4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

// console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();

        // places
        const database = client.db("toursim");
        const placesCollections = database.collection("places")

        // Bid plaes
        const database2 = client.db("tourism")
        const biddingPlaces = database2.collection("bidConfirm")

        // Get Api
        app.get('/places', async (req, res) => {
            const cursor = placesCollections.find({});
            const places = await cursor.toArray();
            res.send(places);
        })

        // Get Api

        app.get('/choosedPlace/:id', async (req, res) => {
            console.log(req.params.id)
            const result = await placesCollections.find({ _id: ObjectId(req.params.id) }).toArray();
            res.send(result[0]);
        })

        // Post Api
        app.post('/places', async (req, res) => {
            const place = req.body;
            console.log('hti the data', place)

            const result = await placesCollections.insertOne(place);
            res.json(result);
        })

        // BidConfirm
        app.post('/bidConfirm', async (req, res) => {
            const bid = req.body;
            const result = await biddingPlaces.insertOne(bid)
            res.send(result);
        })
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})