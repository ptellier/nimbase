const db  = require('./database/dbConn.js');
const express = require('express');
const cors = require('cors')
const verifyJWT = require("./middleware/verifyJWT");
const port = 8080;
const app = express();

let CORS_OPTIONS = {
    origin : ['http://localhost:3000'],
    credentials : true,
}

app.use(cors(CORS_OPTIONS));

// root sends welcome message
app.get('/', (req, res) => {
    res.send('Welcome to the Nimbase Back-end API!');
});

app.get('/api', async (req, res) => {
    const collection = db.collection("users");
    const result = await collection.find({}).toArray();
    res.send(result);
});

app.use(express.json());
app.use('/api/auth', require('./routes/auth.js'));
app.use('/api/register', require('./routes/register.js'));

app.use(verifyJWT);

app.use('/api/project', require('./routes/project.js'));
app.use('/api/user', require('./routes/user.js'));


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
