
const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000
app.use(cors())

// ismat_jahan_carDoctor
// 1M7974pESM5sxDRY


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@ac-euh9qdo-shard-00-00.hbyxuz9.mongodb.net:27017,ac-euh9qdo-shard-00-01.hbyxuz9.mongodb.net:27017,ac-euh9qdo-shard-00-02.hbyxuz9.mongodb.net:27017/?ssl=true&replicaSet=atlas-ny4qda-shard-0&authSource=admin&retryWrites=true&w=majority`;
MongoClient.connect(uri, function (err, client) {
    const collection = client.db("test").collection("devices");
    // perform actions on the collection object
    client.close();
});



// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();


        const servicesCollection = client.db('carDoctorDB').collection('services')
        const bookingCollection = client.db('carDoctorDB').collection('booking')
        // 1. do post method manually


        // 2. find multiple documents
        // const servicesCollection=client.db('carDoctorDB').collection('services') start

        app.get('/services', async (req, res) => {
            const result = await servicesCollection.find().toArray()
            res.send(result)
        })

        // eita diye service er details page e gese
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await servicesCollection.findOne(query)
            res.send(result)
        })


        // eita diye checkout page e jabe kintu info nibe services theke
        app.get('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const options = {
                projection: { title: 1, price: 1, service_id: 1, img: 1 },
            };
            // console.log(options)
            const result = await servicesCollection.findOne(query, options)
            res.send(result)
        })

        // const servicesCollection=client.db('carDoctorDB').collection('services') end


        // const bookingCollection=client.db('carDoctorDB').collection('booking') start
        app.post('/bookings', async (req, res) => {
            const booking = req.body;
            console.log(booking)
            const result = await bookingCollection.insertOne(booking)
            res.send(result)
        })

        // sum data
        app.get('/bookings', async (req, res) => {
            // console.log(req.query.email)
            let query = {};
            if (req.query?.email) {
                query = { email: req.query.email }
            }
            const result = await bookingCollection.find(query).toArray()
            res.send(result)
        })


        // bookings delete
        app.delete('/bookings/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await bookingCollection.deleteOne(query)
            res.send(result)
        })


        // bookings update
        app.patch('/bookings/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const updatedBooking = req.body;
            console.log(updatedBooking)
            const updatedDoc = {
                $set: {
                    status: updatedBooking.status
                }
            }
            const result = await bookingCollection.updateOne(query, updatedDoc)
            res.send(result)
        })




        // const bookingCollection=client.db('carDoctorDB').collection('booking') end



        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.use(express.json())
app.get('/', (req, res) => {
    res.send('Car doctor is running')
})

app.listen(port, () => {
    console.log(`Car doctor is running on port ${port}`)
})