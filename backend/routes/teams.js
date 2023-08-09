const express = require('express');
const router = express.Router();
const db = require('../database/dbConn.js');
const check = require('../controller/check.js');
const {ObjectId} = require("mongodb");

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

    return res.status(200).json(team.members);

});

router.post('/:teamName/addMember/:username', express.json (),async (req, res) => {
    const teams = db.collection('teams');
    const username = req.params.username;
    const teamName = req.params.teamName;

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

router.post('/:teamName/removeMember/:username', express.json (),async (req, res) => {
    const teams = db.collection('teams');
    const username= req.params.username;
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

//used for testing
router.get('/getTeams', async (req, res) => {
    const projects = db.collection('projects');
    const allTeams = await projects.find().toArray();
    return res.status(200).json(allTeams);
});

router.post('/:teamName/addProject/:projectName', express.json(), async (req, res) => {
    const teams = db.collection('teams');
    const projectName = req.params.projectName;
    const teamName = req.params.teamName;
    const {username} = req.body;

    const team = await teams.findOne({teamName: teamName});

    if(!team) {
        return res.status(404).send("Team not found");
    }

    if(team.projects.includes(projectName)) {
        return res.status(400).send("Project already in team");
    }

    const projects = db.collection("projects");
    const project = await projects.findOne({name: projectName});

    if (!project) {
        return res.status(404).send("Project does not exist");
    }

    // remove this if you want to add projects to teams for testing
   if (project.owner !== username) {
       return res.status(401).send("You are not the owner of this project");
    }

    await teams.updateOne({teamName: teamName}, {$push: {projects: projectName}});
    return res.status(200).send("Project added to team");
});

router.post('/:teamName/removeProject/:projectName', express.json(), async (req, res) => {
    try {
        const teams = db.collection('teams');
        const projects = db.collection("projects");

        const projectName = req.params.projectName;
        const teamName = req.params.teamName;
        const { username } = req.body;

        const team = await teams.findOne({ teamName: teamName });
        if (!team) {
            return res.status(404).send("Team not found");
        }

        if (!team.projects.includes(projectName)) {
            return res.status(400).send("Project not in team");
        }

        const project = await projects.findOne({ name: projectName });
        if (!project) {
            return res.status(404).send("Project not found");
        }

        if (project.owner !== username) {
            return res.status(401).send("You are not the owner of this project");
        }

        await teams.updateOne({ teamName: teamName }, { $pull: { projects: projectName } });
        return res.status(200).send("Project removed from team");

    } catch (error) {
        return res.status(500).send("Internal server error");
    }
});

router.post('/:teamName', express.json(), async (req, res) => {
    const teams = db.collection('teams');
    const teamName = req.params.teamName;
    const {username} = req.body;

    const team = await teams.findOne({teamName: teamName});

    if(!team) {
        return res.status(404).send("Team not found");
    }

    if (team.owner !== username) {
        return res.status(401).send("You are not the owner of this team");
    }

    await teams.deleteOne({teamName: teamName});
    return res.status(200).send('Team deleted');
});


module.exports = router;




