const dotenv = require("dotenv");
const uri = process.env.MONGODB_URI || dotenv.config().parsed.MONGODB_URI;

const { MongoClient, ServerApiVersion } = require("mongodb");

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let conn;
async function run() {
    try {
        conn = await client.connect();
        console.log("Connected successfully to server");
    } finally {
    }
}
run().catch(console.dir);

const db = client.db("rollback");
module.exports = db