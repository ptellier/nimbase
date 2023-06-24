const express = require('express');
const check = require('../controller/check.js');
const router = express.Router();
const db  = require('../database/dbConn.js');

// get all projects (ids) of a user
router.get('/:username/projects', express.json(), async (req, res) => {
  if (!check.isString(req.params.username)) {
    res.status(400).send("need username -> string in path parameters");
    return;
  }
  const users = db.collection("users");
  const result = await users.findOne({username: req.params.username}, {projection: {_id: 0, project_ids: 1}});
  if (!result) {res.status(404).send(result);}
  if (!check.isStringArray(result.project_ids)) {console.error("result.project_ids should have been a string array");}
  res.status(200).send(result);
});

module.exports = router;