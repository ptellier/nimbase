const db  = require('./database/dbConn.js');
const express = require('express');
const port = 8080;
const app = express();

app.get('/', (req, res) => {
    res.send('Hello World!');
    }
);

app.get('/api', async (req, res) => {
    const collection = db.collection("context");
    const result = await collection.find({}).toArray();
    res.send(result);
    }
);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
    }
);