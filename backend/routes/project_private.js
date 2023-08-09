const express = require("express");
const check = require("../controller/check.js");
const { ObjectId } = require("mongodb");
const db = require("../database/dbConn.js");

const router = express.Router();
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
  const result1 = await projects.insertOne(req.body);
    const insertedId = result1.insertedId;
    const result2 = await users.findOneAndUpdate(
        { _id: new ObjectId(ownerUser._id)},
        { $push: { project_ids: insertedId.toString() } },
    );
    return res.status(200).json({ _id: insertedId });
});

router.post("/createfiles", async (req, res) => {
  const projects = db.collection("projects");
  const users = db.collection("users");
  const { _id, github_url, env_vars } = req.body;
  
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
        url: `http://${req.body._id}.${process.env.HOSTNAME}`,
        services: req.body.services,
      },
    }
  );
  return res.status(200).json({ message: "project updated" });
});


router.post("/deploy", async (req, res) => {
  const projects = db.collection("projects");
  const { _id } = req.body;
  console.log("this is the id" , _id);
  const project = await projects.findOne({ _id: new ObjectId(_id) });
  if (!project) {
    return res.status(400).json({ message: "project does not exist" });
  }
  const config_services = {
    client: project.client,
    server: project.server,
    connection_url: project.connection_url
  }
  const result = await configureDockerComposeFiles(_id, config_services);
  console.log(result);
  const deployResult = await deployDocker(_id);
  console.log(deployResult);
  return res.status(200).json({ message: "project deployed" });
});



// get an existing project by id
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
    const removeResult = await removeProject(req.params.id);
    console.log(removeResult);
  res.status(200).send(resultUpdate);
});

module.exports = router;
