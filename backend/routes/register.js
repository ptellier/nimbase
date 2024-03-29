const express = require("express");
const check = require("../controller/check.js");
const router = express.Router();
const db = require("../database/dbConn.js");
const bcrypt = require("bcrypt");

/****** USER COLLECTION *****************/
/**
 * schema:
 * {
 *   _id: ObjectId,
 *   username: string,
 *   password_hash: string,
 *   email: string,
 *   project_ids: ObjectId[],
 * }
 * note: do not include _id in create new user requests as this is auto-generated by mongodb
 * note: do not project_ids in create new user requests as this starts off empty
 */

// create a new user
// REQUIRES: JSON body matching user schema (excluding _id and project_ids)
// REQUIRES: username is not already taken
// REQUIRES: email is not already taken
// REFERENCE: taken from JWT-Auth-tutorial by Dave Gray https://github.com/gitdagray/express_jwt/
router.post("/", express.json(), async (req, res) => {
  if (!check.isNewUser(req.body)) {
    if (!check.isEmail(req.body.email)) {
      res.status(400).json({ message: "Invalid email in request body" });
      return;
    }
    res.status(400).json({ message: "Invalid request body" });
    return;
  }
  const { firstName, lastName, username, password, email } = req.body;
  const users = db.collection("users");
  if (await users.findOne({ username: username })) {
    res.status(409).json({ message: "Username already taken" });
    return;
  }
  if (await users.findOne({ email: email })) {
    res.status(409).json({ message: "Email already taken" });
    return;
  }

  try {
    const password_hash = await bcrypt.hash(password, 10);
    const newUser = {
      firstName: firstName,
      lastName: lastName,
      username: username,
      email: email,
      password_hash: password_hash,
      project_ids: [],
      team_ids: [],
    };
    await users.insertOne(newUser);
    res.status(201).json({ success: `New user ${username} created!` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
