const express = require('express');
const check = require('../controller/check.js');
const {ObjectId} = require("mongodb");
const db  = require('../database/dbConn.js');

const router = express.Router();

/****** PROJECT COLLECTION *****************/
/**
 * schema:
 * {
 *   _id: ObjectId,
 *   owner: string,
 *   name: string,
 *   description: string,
 *   public: boolean
 *   dockerfile: string,
 *   github_url: string,
 *   github_auth_tokens: string,
 * }
 * note: also need username of owner in the request body: owner -> string
 * note: do not include _id in create new projects requests as this is auto-generated by mongodb
 */

// create a new project
// REQUIRES: JSON body matching project schema
// REQUIRES: owner is the username of an existing user
router.post('/api/project', express.json(), async (req, res) => {
  if (!check.isProject(req.body)) {
    res.status(400).send("invalid project in request body (as json)");
    return;
  }
  const projects = db.collection("projects");
  const users = db.collection("users");
  let ownerUser = await users.findOne({username: req.body.owner});
  if (!ownerUser) {
    res.status(400).send("user does not exist");
    return;
  }
  const result1 = await projects.insertOne(req.body);
  const insertedId = result1.insertedId.toString();
  if (!Array.isArray(ownerUser.project_ids)) {console.error("ownerUser.project_ids should br a string array");}
  ownerUser.project_ids.push(insertedId);
  const result2 = await users.updateOne({_id: ownerUser._id}, { $set: ownerUser});
  res.status(200).send(result2);
});

// get an existing project
router.get('/api/project/:id', express.json(), async (req, res) => {
  if (!check.isString(req.params.id)) {
    res.status(400).send("need id -> string in path parameter");
    return;
  }
  const projects = db.collection("projects");
  const result = await projects.findOne({_id: new ObjectId(req.params.id)});
  if (!result ) {
    res.status(404).send(result);
    return;
  }
  res.status(200).send(result);
});

// set an existing project's fields (all of them except _id)
// REQUIRES: JSON body matching project schema and _id -> matching project to update
router.put('/api/project', express.json(), async (req, res) => {
  if (!check.isProjectPut(req.body)) {
    res.status(400).send("invalid 'project put' in request body (as json)");
    return;
  }
  const projects = db.collection("projects");
  req.body._id = new ObjectId(req.body._id);
  const result = await projects.updateOne({_id: req.body._id}, { $set: req.body});
  if (!result ) {
    res.status(404).send(result);
    return;
  }
  res.status(200).send(result);
});

// get all existing projects
router.get('/api/projects', express.json(), async (req, res) => {
  const projects = db.collection("projects");
  // TODO: create endpoint for all public projects (filter by field: public = true)
  if (!projects ) {
    res.status(404).send(projects);
    return;
  }
  res.status(200).send(projects);
});

// TODO: perform gitHub action on project '/api/project/deploy'

module.exports = router;