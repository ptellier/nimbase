
const { MongoClient, ServerApiVersion } = require('mongodb');
const dotenv = require('dotenv');

const uri = dotenv.config().parsed.MONGODB_URI;
// console.log(uri)


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
    await client.close();
  }
}
run().catch(console.dir);


//create a express server at port 8080
const express = require('express');
const app = express();

const port = 8080;

app.get('/', (req, res) => {
    run()
    res.send('Hello World!');
    }
);

app.get('/api', (req, res) => {
    res.send('Hello World! from api');
    }
);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
    }
);



//write a router
// const router = express.Router()