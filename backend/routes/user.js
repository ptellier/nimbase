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
router.get('/:username/teams', express.json(), async (req, res) => {
  const username = req.params.username;
  const teams = db.collection('teams');
  const createdTeam = await teams.find({owner: username}).toArray();
  if(createdTeam.length === 0) {
    return res.status(404).send("No teams found");
  }
  res.status(200).json(createdTeam);
});

module.exports = router;