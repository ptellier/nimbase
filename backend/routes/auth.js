// REFERENCE: taken from JWT-Auth-tutorial by Dave Gray https://github.com/gitdagray/express_jwt/

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db  = require('../database/dbConn.js');
const router = express.Router();

const MAX_AGE_OF_REFRESH_TOKEN_COOKIE = 24 * 60 * 60 * 1000; // 1 day (in milliseconds)
const EXPIRY_TIME_OF_ACCESS_TOKEN = '1d';
const EXPIRY_TIME_OF_REFRESH_TOKEN = '30s';


// authenticate/login user
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ 'message': 'Username and password are required.' });
  }
  const users = db.collection("users");
  const foundUser = await users.findOne({username: username});
  if (!foundUser ) {
    return res.status(401).send(foundUser); //Unauthorized
  }
  // evaluate password
  console.log("foundUser: ", foundUser.password_hash)
  console.log("password: ", password)
  const match = await bcrypt.compare(password, foundUser.password_hash);
  if (match) {
    // create JWTs
    const accessToken = jwt.sign(
      { "username": foundUser.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: EXPIRY_TIME_OF_ACCESS_TOKEN }
    );
    const refreshToken = jwt.sign(
      { "username": foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: EXPIRY_TIME_OF_REFRESH_TOKEN }
    );
    // Saving refreshToken with current user
    await users.updateOne({username: foundUser.username}, { $set: {refreshToken: refreshToken}});
    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: MAX_AGE_OF_REFRESH_TOKEN_COOKIE
    });
    res.json({ accessToken });
  } else {
    res.sendStatus(401);
  }
});


// logout user
router.post('/logout', async (req, res) => {
  // on client, also delete the accessToken
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //No content
  const refreshToken = cookies.jwt;

  // is refreshToken in db?
  const users = db.collection("users");
  const foundUser = await users.findOne({refreshToken: refreshToken});
  if (foundUser) {
    await users.updateOne({username: foundUser.username}, { $set: ''});
  }
  res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true });
  res.sendStatus(204);
});


// refresh accessToken
router.get('/refresh', async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;

  const users = db.collection("users");
  const foundUser = await users.findOne({refreshToken: refreshToken});
  if (!foundUser) {
    return res.sendStatus(403); //Forbidden
  }

  // evaluate jwt
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (err, decoded) => {
      if (err || foundUser.username !== decoded.username) return res.sendStatus(403);
      const accessToken = jwt.sign(
        { "username": decoded.username },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '30s' }
      );
      res.json({ accessToken })
    }
  );
});

module.exports = router;
