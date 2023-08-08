const express = require("express");
const check = require("../controller/check.js");
const { ObjectId } = require("mongodb");
const db = require("../database/dbConn.js");

const router = express.Router();
// import {
//   cloneRepo,
//   envFileWrite,
//   analyzeServices,
//   configureDockerComposeFiles,
//   deployDocker,
//   removeProject,
// } from "../utils/devopServices.js";

const {cloneRepo, envFileWrite, analyzeServices, configureDockerComposeFiles, deployDocker, removeProject} = require("../utils/devopServices.js");

router.post("/init", async (req, res) => {
  console.log(req.body);
  const projects = db.collection("projects");
  const users = db.collection("users");
  if (!check.isProject(req.body)) {
    console.log("invalid project in request body (as json)");
    res
      .status(400)
      .json({ message: "invalid project in request body (as json)" });
    return;
  }

  let ownerUser = await users.findOne({ username: req.body.owner });
  if (!ownerUser) {
    res.status(400).json({ message: "user does not exist" });
    return;
  }
  // console.log(req.body);
  const result1 = await projects.insertOne(req.body);
    const insertedId = result1.insertedId;
    const result2 = await users.findOneAndUpdate(
        // ownerUser._id,
        { _id: new ObjectId(ownerUser._id)},
        { $push: { project_ids: insertedId.toString() } },
    );
    // console.log(result2);
    // console.log("here is the id", ownerUser._id);
    return res.status(200).json({ _id: insertedId });
});

router.post("/createfiles", async (req, res) => {
  const projects = db.collection("projects");
  const users = db.collection("users");
  const { _id, github_url, env_vars } = req.body;
  
  // clone repo
  const cloneResult = await cloneRepo(github_url, _id);
  const envFileResult = await envFileWrite(env_vars, _id);
  const {status, message, services } = await analyzeServices(_id);
  
  return res.status(200).json({ services : services });
});

router.post("/update", async (req, res) => {
  const projects = db.collection("projects");
  if (!check.isProjectPut(req.body)) {
    if (!validator.isMongoId(req.body._id)) {
      return res.status(400).json({
        message: "need _id -> mongoDB ObjectId in request body (as json)",
      });
    }
    return res
      .status(400)
      .json({ message: "invalid 'project put' in request body (as json)" });
  }
  const result = await projects.findOneAndUpdate(
    { _id: new ObjectId(req.body._id) },
    {
      $set: {
        name: req.body.name,
        description: req.body.description,
        image: req.body.image,
        public: req.body.public,
        github_url: req.body.github_url,
        env_vars: req.body.env_vars,
        client: req.body.client,
        connection_url: req.body.connection_url,
        server: req.body.server,
        url: `${req.body._id}.${process.env.HOSTNAME}`,
        services: req.body.services,
      },
    }
  );
  return res.status(200).json({ message: "project updated" });
});


// create a project
// router.post("/:id", async (req, res) => {
//   let _id = req.params.id;
//   const projects = db.collection("projects");
//   const users = db.collection("users");
//   if (_id == null || _id == "") {
//     if (!check.isProject(req.body)) {
//       console.log("invalid project in request body (as json)");
//       res
//         .status(400)
//         .json({ message: "invalid project in request body (as json)" });
//       return;
//     }

//     let ownerUser = await users.findOne({ username: req.body.owner });
//     if (!ownerUser) {
//       res.status(400).json({ message: "user does not exist" });
//       return;
//     }
  
//     const result1 = await projects.insertOne(req.body);
//     const insertedId = result1.insertedId;
//     const result2 = await users.findOneAndUpdate(
//         ownerUser._id,
//         { $push: { projects: insertedId } },
//     );
//     _id = insertedId;
//   }else{
//     // update existing project
//     if (!check.isProjectPut(req.body)) {
//       if (!validator.isMongoId(req.body._id)) {
//         return res.status(400).json({
//           message: "need _id -> mongoDB ObjectId in request body (as json)",
//         });
//       }
//       return res
//         .status(400)
//         .json({ message: "invalid 'project put' in request body (as json)" });
//     }
//     const result = await projects.findOneAndUpdate(
//       { _id: new ObjectId(req.body._id) },
//       {
//         $set: {
//           name: req.body.name,
//           description: req.body.description,
//           image: req.body.image,
//           public: req.body.public,
//           github_url: req.body.github_url,
//           env_vars: req.body.env_vars,
//           client: req.body.client,
//           connection_url: req.body.connection_url,
//           server: req.body.server,
//           url: `${_id}.${process.env.HOSTNAME}`,
//         },
//       }
//     );
//     return res.json(result);
//   }
  
//   // clone repo
//   console.log(`Cloning project ${req.body.name}`);
//   const result3 = await cloneRepo(req.body.github_url, _id);
//   const result4 = await envFileWrite(req.body.env_vars, _id);
//   const result5 = await analyzeServices(_id);
//   return res.json(result5);
// });




/****** PROJECT COLLECTION *****************/
/**
 * schema:
 * {
 *    _id: _id,
 *    owner: project.owner || "",
 *    name: project.name || "",
 *    description: project.description || "",
 *    image: project.image || "",
 *    public: project.isPublic || false,
 *    github_url: project.github_url || "",
 *    env_vars: project.env_vars || "",
 *    client: project.client || "",
 *    connection_url: project.connection_url || "",
 *    server: project.server || "",
 *    url: project.url || "",
 * }
 * note: also need username of owner in the request body: owner -> string
 * note: do not include _id in create new projects requests as this is auto-generated by mongodb
 */

// create a new project
// REQUIRES: JSON body matching project schema
// REQUIRES: owner is the username of an existing user
// router.post("/", express.json(), async (req, res) => {
//   console.log("creating new project");
//   if (!check.isProject(req.body)) {
//     console.log("invalid project in request body (as json)");
//     res
//       .status(400)
//       .json({ message: "invalid project in request body (as json)" });
//     return;
//   }
//   const projects = db.collection("projects");
//   const users = db.collection("users");
//   let ownerUser = await users.findOne({ username: req.body.owner });
//   if (!ownerUser) {
//     res.status(400).json({ message: "user does not exist" });
//     return;
//   }
//   const result1 = await projects.insertOne(req.body);
//   console.log(result1);
//   const insertedId = result1.insertedId.toString();
//   if (!Array.isArray(ownerUser.project_ids)) {
//     console.error("ownerUser.project_ids should br a string array");
//   }
//   ownerUser.project_ids.push(insertedId);
//   const result2 = await users.updateOne(
//     { _id: ownerUser._id },
//     { $set: ownerUser }
//   );
//   res
//     .status(200)
//     .send({ message: "successfully created project", id: insertedId });
// });

// get an existing project
router.get("/:id", express.json(), async (req, res) => {
  if (!check.isString(req.params.id)) {
    res.status(400).json({ message: "need id -> string in path parameter" });
    return;
  }
  const projects = db.collection("projects");
  const result = await projects.findOne({ _id: new ObjectId(req.params.id) });
  if (!result) {
    res.status(404).send(result);
    return;
  }
  res.status(200).send(result);
});

// get an existing project by project name
router.get("/name/:project_name", express.json(), async (req, res) => {
  const projectName = req.params.project_name;
  const projects = db.collection("projects");
  const result = await projects.findOne({ name: projectName });
  if (!result) {
    res.status(404).send(result);
    return;
  }
  res.status(200).send(result);
});

// set an existing project's fields (all of them except _id)
// REQUIRES: JSON body matching project schema and _id -> matching project to update
router.put("/", express.json(), async (req, res) => {
  if (!check.isProjectPut(req.body)) {
    if (!validator.isMongoId(req.body._id)) {
      return res.status(400).json({
        message: "need _id -> mongoDB ObjectId in request body (as json)",
      });
    }
    return res
      .status(400)
      .json({ message: "invalid 'project put' in request body (as json)" });
  }
  const projects = db.collection("projects");
  req.body._id = new ObjectId(req.body._id);
  const result = await projects.updateOne(
    { _id: req.body._id },
    { $set: req.body }
  );
  console.log(result);
  if (!result || result.matchedCount === 0) {
    res.status(404).send(result);
    return;
  }
  res.status(200).send(result);
});

// delete a project by id
router.delete("/:id", express.json(), async (req, res) => {
  if (!validator.isMongoId(req.params.id)) {
    return res
      .status(400)
      .json({ message: "need path parameter to be a mongoDB id" });
  }
  const projects = db.collection("projects");
  const users = db.collection("users");
  const resultFind = await projects.findOne({
    _id: new ObjectId(req.params.id),
  });
  if (!resultFind || resultFind.owner !== req.user) {
    res.status(404).json({
      message:
        "Could not find a project with id " +
        req.params.id +
        "belonging to " +
        req.user,
    });
    return;
  }
  const resultDelete = await projects.deleteOne({
    _id: new ObjectId(req.params.id),
  });
  const resultUpdate = await users.updateOne(
    { username: req.user },
    { $pull: { project_ids: req.params.id } }
  );
  res.status(200).send(resultUpdate);
});

module.exports = router;
