// REFERENCE: taken from JWT-Auth-tutorial by Dave Gray https://github.com/gitdagray/express_jwt/

const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../database/dbConn.js");
const router = express.Router();
const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(CLIENT_ID);

const MAX_AGE_OF_REFRESH_TOKEN_COOKIE = 24 * 60 * 60 * 1000;
const EXPIRY_TIME_OF_ACCESS_TOKEN = "1d";
const EXPIRY_TIME_OF_REFRESH_TOKEN = "7d";

// authenticate/login user
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }
  const users = db.collection("users");
  const foundUser = await users.findOne({ username: username });
  if (!foundUser) {
    return res
      .status(401)
      .json({ message: `Could not find user "${username}"` });
  }
  console.log("foundUser: ", foundUser.password_hash);
  console.log("email: ", foundUser.email);
  const match = await bcrypt.compare(password, foundUser.password_hash);
  if (match) {
    const accessToken = jwt.sign(
      { username: foundUser.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: EXPIRY_TIME_OF_ACCESS_TOKEN }
    );
    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: EXPIRY_TIME_OF_REFRESH_TOKEN }
    );
    await users.updateOne(
      { username: foundUser.username },
      { $set: { refreshToken: refreshToken } }
    );
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: MAX_AGE_OF_REFRESH_TOKEN_COOKIE,
    });
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Credentials", true);
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.json({ username, email: foundUser.email, accessToken });
  } else {
    res.status(401).json({ message: "Password is incorrect" });
  }
});

router.post("/logout", async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204);
  const refreshToken = cookies.jwt;

  const users = db.collection("users");
  const foundUser = await users.findOne({ refreshToken: refreshToken });
  if (foundUser) {
    await users.updateOne(
      { username: foundUser.username },
      { $set: { refreshToken: "" } }
    );
  }
  res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });
  res.sendStatus(204);
});

router.post("/refresh", async (req, res) => {
  const refreshToken = req.cookies.jwt;

  if (!refreshToken) {
    return res.sendStatus(401);
  }

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }

      const users = db.collection("users");
      const foundUser = await users.findOne({ refreshToken: refreshToken });

      if (!foundUser) {
        return res.sendStatus(403);
      }

      const newAccessToken = jwt.sign(
        { username: user.username },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: EXPIRY_TIME_OF_ACCESS_TOKEN }
      );

      const newRefreshToken = jwt.sign(
        { username: foundUser.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: EXPIRY_TIME_OF_REFRESH_TOKEN }
      );

      await users.updateOne(
        { username: foundUser.username },
        { $push: { refreshTokens: newRefreshToken } }
      );

      res.json({ accessToken: newAccessToken });
    }
  );
});

router.post("/google/login", async (req, res) => {
  const { tokenId } = req.body;
  const response = await client.verifyIdToken({
    idToken: tokenId,
    audience: CLIENT_ID,
  });
  const { email_verified, name, email } = response.getPayload();

  if (email_verified) {
    const users = db.collection("users");
    let user = await users.findOne({ email: email });
    if (!user) {
      user = { username: email, email: email, project_ids: [] };
      await users.insertOne(user);
    }

    const accessToken = jwt.sign(
      { username: user.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: EXPIRY_TIME_OF_ACCESS_TOKEN }
    );

    const refreshToken = jwt.sign(
      { username: user.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: EXPIRY_TIME_OF_REFRESH_TOKEN }
    );

    await users.updateOne(
      { username: user.username },
      { $set: { refreshToken: refreshToken } }
    );

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: MAX_AGE_OF_REFRESH_TOKEN_COOKIE,
    });
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Credentials", true);
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.json({ username: user.username, email: user.email, accessToken });
  } else {
    res.status(401).json({ message: "Email not verified by Google" });
  }
});
module.exports = router;
