const express = require('express');
const router = express.Router();
const db = require('../database/dbConn.js');
const check = require('../controller/check.js');

/**
 * Team Schema:
 * {
 *  _id: ObjectId,
 *  teamName: string,
 *  description: string,
 *  members: string[],
 *  projects: string[],
 *  owner: string,
 */

// creating a new team

router.post('/', express.json(), async (req, res) => {
    const {teamName, description, owner} = req.body;
    const teams = db.collection('teams');

    if(!teamName || !description || !owner) {
        return res.status(400).send("Missing required fields");
    }
    console.log(req.body)

    const existingTeam = await teams.findOne({teamName: teamName});
    if(existingTeam){
        return res.status(400).send("Team name already exists");
    }

    const newTeam = { teamName, description, owner, members: [owner], projects: [] };
    await teams.insertOne(newTeam);
    return res.status(201).json({ 'success': `New team ${teamName} created!` });
});

router.get('/:teamName', express.json(), async (req, res) => {
    const teams = db.collection('teams');
    const team = await teams.findOne({teamName: req.params.teamName});

    if(!team) {
        return res.status(404).send("Team not found");
    }

    return res.status(200).json(team);
});

router.get('/:teamName/members', express.json(), async (req, res) => {
    const teams = db.collection('teams');
    const team = await teams.findOne({teamName: req.params.teamName});

    if(!team) {
        return res.status(404).send("Team not found");
    }

    console.log("inside teammates route - team: ", team);

    console.log("inside teammates route - memebers: ", team.members);

    return res.status(200).json(team.members);

});

router.post('/:teamName/addMember', express.json (),async (req, res) => {
    const teams = db.collection('teams');
    const {username} = req.body;
    const teamName = req.params.teamName;

    console.log("inside add member route - username", username);
    console.log("inside add member route - teamname", teamName);

    const team = await teams.findOne({teamName: teamName});

    if(!team) {
        return res.status(404).send("Team not found");
    }

    if(team.members.includes(username)) {
        return res.status(400).send("User already in team");
    }

    const user = await db.collection('users').findOne({ username });

    if (!user) {
        return res.status(404).send("Username not found");
    }

    await teams.updateOne({teamName: teamName}, {$push: {members: username}});
    return res.status(200).send("User added to team");
});

router.post('/:name/removeMember', express.json (),async (req, res) => {
    const teams = db.collection('teams');
    const {username} = req.body;
    const teamName = req.params.teamName;

    const team = await teams.findOne({teamName: teamName});

    if(!team) {
        return res.status(404).send("Team not found");
    }

    if(!team.members.includes(username)) {
        return res.status(400).send("User not in team");
    }

    await teams.updateOne({teamName: teamName}, {$pull: {members: username}});
    return res.status(200).send("User removed from team");
});

router.post('/:teamName/addProject', express.json(), async (req, res) => {
   console.log("inside add project route");
    const teams = db.collection('teams');
    const {projectName} = req.body;
    const teamName = req.params.teamName;

    const team = await teams.findOne({teamName: teamName});

    if(!team) {
        return res.status(404).send("Team not found");
    }

    if(team.projects.includes(projectName)) {
        return res.status(400).send("Project already in team");
    }

    await teams.updateOne({teamName: teamName}, {$push: {projects: projectName}});
    return res.status(200).send("Project added to team");
});

router.post('/:teamName/removeProject', express.json(), async (req, res) => {
    const teams = db.collection('teams');
    const {projectName} = req.body;
    const teamName = req.params.teamName;

    const team = await teams.findOne({teamName: teamName});

    if(!team) {
        return res.status(404).send("Team not found");
    }

    if(!team.projects.includes(projectName)) {
        return res.status(400).send("Project not in team");
    }

    await teams.updateOne({teamName: teamName}, {$pull: {projects: projectName}});
    return res.status(200).send("Project removed from team");
});

router.delete('/:teamName', express.json(), async (req, res) => {
    const teams = db.collection('teams');
    const teamName = req.params.teamName;

    const team = await teams.findOne({teamName: teamName});

    if(!team) {
        return res.status(404).send("Team not found");
    }
    await teams.deleteOne({teamName: teamName});
    return res.status(200).send('Team deleted');
});


module.exports = router;




