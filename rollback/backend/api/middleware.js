//middleware to check validity of jwt token

const jwt = require('jsonwebtoken');

function middleware(req, res, next) {
    const token = req.cookies.token; 
    console.log(token);
    if (!token) return res.status(401).send({msg: "Access denied. No token provided."});
    try {
        const decoded = jwt.verify(token, "helloworld");
        req.user = decoded;
        console.log(decoded);
        next();
    } catch (ex) {
        res.status(400).send({msg: "Invalid token."});
    }
}

module.exports = middleware;