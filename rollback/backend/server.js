const db  = require('./database/dbConn.js');
const express = require('express');
const check = require('./api/check.js');
const {isStringArray} = require("./api/check");
const {ObjectId} = require("mongodb");
const port = 8080;
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
// app.use(cors());
app.use(express.json());
const cookieParser = require('cookie-parser');
app.use(cookieParser());

const middleware = require('./api/middleware.js');

// configure headers for the app

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
    accessControlAllowCredentials: true,
    accessControlAllowOrigin: true,
};

app.use(cors(corsOptions));

// root sends welcome message
app.get('/', (req, res) => {
    res.send('Welcome to the rollback Back-end API!');
});


app.post('/login', async (req, res) => {

    console.log(req.body);
    const username = req.body.username;
    const password = req.body.password;

    const collection = db.collection("users");
    const result = await collection.findOne({username: username});
    
    if (result) {
        if (result.password === password) {
            const SECRET_KEY = "helloworld"
            const token = jwt.sign({username: username}, SECRET_KEY);
            console.log(token);
            return res.status(200).cookie('token', token, {httpOnly: true, sameSite:'none', secure: true, maxAge: 3600000}).send({msg: "login successful", isAuth: true});
        }
        else {
            return res.status(401).send({msg: "incorrect password", isAuth: false});
        }
    }
    return res.status(404).send({msg: "user not found", isAuth: false});
});


app.post('/register', async (req, res) => {
    console.log(req.body);
    const username = req.body.username;
    const password = req.body.password;
    const address = req.body.address;
    const zipcode = req.body.zipcode;
    const city = req.body.city;
    const country = req.body.country;

    const collection = db.collection("users");
    const result = await collection.findOne({username: username});

    if (result) {
        res.cookie('username', username);
        return res.status(400).send({msg: "username already taken", isAuth: false});
    }
    else {
        const result2 = await collection.insertOne({username: username, password: password, address: address, zipcode: zipcode, city: city, country: country});
        return res.status(200).send({msg: "user created", result: result2, isAuth: false});
    }
});

app.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.status(200).send({msg: "logout successful", isAuth: false});
});

app.get('/verify', middleware, (req, res) => {
    res.status(200).send({msg: "token verified", isAuth: true});
});

app.post('/create', middleware, async (req, res) => {
    console.log(req.body);
    const collection = db.collection("listing");
    const result = await collection.insertOne(req.body);
    console.log(result);
    return res.status(200).send({msg: "listing created", result: result});
});

app.get('/getlistings', async (req, res) => {
    const collection = db.collection("listing");
    const result = await collection.find({}).toArray();
    console.log(result);
    return res.status(200).send({msg: "listings retrieved", result: result});
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
