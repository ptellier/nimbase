const express = require('express');
const db  = require('../database/dbConn.js');

const router = express.Router();

// get all existing projects with public set to true
router.get('/', express.json(), async (req, res) => {
  const projectsCollection = db.collection("projects");
  const projects = await projectsCollection.find({ public: true }).toArray();
  if (!projects ) {
    console.log(projects);
    res.status(404).send(projects);
    return;
  }
  res.status(200).send(projects);
});

// TODO: perform gitHub action on project '/api/project/deploy'

module.exports = router;