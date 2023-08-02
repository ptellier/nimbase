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
 *   image: null | string,
 *   public: boolean
 *   dockerfile: string,
 *   dockerfile
 *   github_url: string,
 *   github_auth_tokens: string,
 *   env_vars: string,
 *   entry_port: string,
 * }
 * note: also need username of owner in the request body: owner -> string
 * note: do not include _id in create new projects requests as this is auto-generated by mongodb
 */

// create a new project
// REQUIRES: JSON body matching project schema
// REQUIRES: owner is the username of an existing user
router.post('/', express.json(), async (req, res) => {
  console.log(req.body);
  console.log("creating new project");
  if (!check.isProject(req.body)) {
    console.log("invalid project in request body (as json)");
    res.status(400).json({message: "invalid project in request body (as json)"});
    return;
  }
  const projects = db.collection("projects");
  const users = db.collection("users");
  let ownerUser = await users.findOne({username: req.body.owner});
  if (!ownerUser) {
    res.status(400).json({message: "user does not exist"});
    return;
  }
  const result1 = await projects.insertOne(req.body);
  console.log(result1)
  const insertedId = result1.insertedId.toString();
  if (!Array.isArray(ownerUser.project_ids)) {console.error("ownerUser.project_ids should br a string array");}
  ownerUser.project_ids.push(insertedId);
  const result2 = await users.updateOne({_id: ownerUser._id}, { $set: ownerUser});
  res.status(200).send({message: "successfully created project", id: insertedId});
});

// get an existing project
router.get('/:id', express.json(), async (req, res) => {
  if (!check.isString(req.params.id)) {
    res.status(400).json({message: "need id -> string in path parameter"});
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
router.put('/', express.json(), async (req, res) => {
  if (!check.isProjectPut(req.body)) {
    if (!validator.isMongoId(req.body._id)) {
      return res.status(400).json({message: "need _id -> mongoDB ObjectId in request body (as json)"});
    }
    return res.status(400).json({message: "invalid 'project put' in request body (as json)"});
  }
  const projects = db.collection("projects");
  req.body._id = new ObjectId(req.body._id);
  const result = await projects.updateOne({_id: req.body._id}, { $set: req.body});
  console.log(result);
  if (!result || result.matchedCount === 0) {
    res.status(404).send(result);
    return;
  }
  res.status(200).send(result);
});

// delete a project by id
router.delete('/:id', express.json(), async (req, res) => {
  if (!validator.isMongoId(req.params.id)) {
    return res.status(400).json({message: "need path parameter to be a mongoDB id"});
  }
  const projects = db.collection("projects");
  const users = db.collection("users");
  const resultFind = await projects.findOne({_id: new ObjectId(req.params.id)});
  if (!resultFind || resultFind.owner !== req.user) {
    res.status(404).json({message: "Could not find a project with id " + req.params.id + "belonging to " + req.user});
    return;
  }
  const resultDelete = await projects.deleteOne({_id: new ObjectId(req.params.id)});
  const resultUpdate = await users.updateOne({username : req.user},
    {$pull: {project_ids: req.params.id}}
  );
  res.status(200).send(resultUpdate);
});

// get all existing projects
router.get('/', express.json(), async (req, res) => {
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