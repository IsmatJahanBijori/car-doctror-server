
const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000
app.use(cors())

// ismat_jahan_carDoctor
// 1M7974pESM5sxDRY


const { MongoClient, ServerApiVersion } = require('mongodb');
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