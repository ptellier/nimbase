const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../database/dbConn.js");
const router = express.Router();

const { exec: execWithCallback } = require("child_process");
const { promisify } = require("util");
const exec = promisify(execWithCallback);
const fs = require("fs");
const { env } = require("process");
const { platform } = require("os");
const { spawn } = require('child_process');
const ObjectId = require("mongodb").ObjectId;

DEFAULT_EXPOSED_PORT = 3003;
REPO_BASE_URL = "devOps/repos";

function spawnPromise(command, args, options) {
    return new Promise((resolve, reject) => {
        const child = spawn(command, args, options);
        let stdout = '';
        let stderr = '';

        child.stdout.on('data', (data) => {
            stdout += data;
        });

        child.stderr.on('data', (data) => {
            stderr += data;
        });

        child.on('close', (code) => {
            if (code === 0) {
                resolve(stdout);
            } else {
                reject(new Error(stderr));
            }
        });
    });
}

async function cloneRepo(link, name, env_variables) {
    try {
        if (fs.existsSync(`${REPO_BASE_URL}/${name}`)) {
            if (process.platform === "win32") {
                console.log("repo already exists, overwriting");
                await exec(`rmdir "${REPO_BASE_URL}/${name}" /s /q`);
            } else if (process.platform === "linux") {
                console.log("repo already exists, overwriting");
                await exec(`rm -rf "${REPO_BASE_URL}/${name}"`);
            }
        }
        const { stdout, stderr } = await exec(
            `git clone ${link} ${REPO_BASE_URL}/${name}`
        );
        console.log("stderr:", stderr);
        fs.writeFileSync(
            `${REPO_BASE_URL}/${name}/.env`,
            env_variables,
            function (err) {
                if (err) throw err;
                console.log("Environment file is created successfully.");
            }
        );
        console.log("Repo cloned/pulled with env variables init");
    } catch (error) {
        console.error(`exec error: ${error}`);
        throw error;
    }
}

async function buildDocker(repoPath, imageName) {
    console.log("Building docker image");
    try {
        const dockerBuild = await spawnPromise("docker", ["build", "-t", imageName, repoPath]);
        console.log(dockerBuild);
        console.log("Docker image built");
        return {status: "success", message: "Docker image built"};
    }
    catch(error){
        console.error(`exec error: ${error}`);
        return {status: "error", message: error};
    }
}

async function runDocker(imageName, user_port) {
    console.log("Running docker image");
    let check = DEFAULT_EXPOSED_PORT;
    if (process.platform === "win32") {
        console.log("win32");
        while (true) {
            check = Math.floor(Math.random() * 1000) + 3000;
            console.log("checking port : ", check);
            const { stdout: port, stderr } = await exec(
                `netstat -ano | findstr :${check} | findstr LISTENING | sort /R`
            );
            if (port === "") {
                console.log("port available : ", check);
                break;
            }
            console.log("stderr:", stderr);
            console.log("port already in use : ", port);
        }
    } else if (process.platform === "linux") {
        console.log("linux");
        while (true) {
            check = Math.floor(Math.random() * 1000) + 3000;
            console.log("checking port : ", check);
            const { stdout: port, stderr } = await exec(
                `netstat -antp 2>/dev/null | grep :${check}`
            );
            if (port === "") {
                console.log("port available : ", check);
                break;
            }
            console.log("stderr:", stderr);
            console.log("port already in use : ", port);
        }
    }
    await exec(`docker run -d -p ${check}:${user_port} ${imageName}`);
    console.log("Docker image running");
    return check;
}

async function stopDocker(imageName) {
    let containerId = "";
    if(process.platform === "win32" || process.platform === "linux"){
        const { stdout, stderr } = await exec(
            `docker ps --filter ancestor=${imageName} --format "{{.ID}}"`
        );
        containerId = stdout.trim();
        console.log("stderr:", stderr);
    }
    if (containerId === "") {
        console.log("No docker image running");
        return {status: "error", message: "No docker image running"};
    }
    console.log("Stopping docker image");
    try {
        const { stdout, stderr } = await exec(
            `docker rm -f ${containerId}`
        );
        console.log("stderr:", stderr);
        console.log("Docker image stopped");
        return {status: "success", message: "Docker image stopped"};
    } catch (error) {
        console.error(`exec error: ${error}`);
        return {status: "error", message: error};
    }
}

router.post("/clone", async (req, res) => {
    let { github_url, name, env_vars, entry_port, _id } = req.body;
    github_url = github_url.trim();
    console.log(github_url + "::" + name + "::" + env_vars + "::" + entry_port);
    try {
        console.log(`Cloning project ${name}`);
        await cloneRepo(github_url, _id, env_vars);
        return res.status(200).json(
          {status: "success", message: `successfully cloned project ${name}`, details: req.body}
          );
    } catch (error) {
        console.error(error);
        return res.status(500).json({status: "error", message: error});
    }
});

router.post("/deploy", async (req, res) => {
    const { id } = req.body;
    const projects = db.collection("projects");
    const foundProject = await projects.findOne({_id: new ObjectId(id)});
    if (!foundProject) {return res.sendStatus(404);}
    console.log(foundProject);
    const repoPath = `${REPO_BASE_URL}/${id}`;
    const imageName = id;

    if (fs.existsSync(`${repoPath}/docker-compose.yml`)) {
        console.log("docker-compose file exists");
        const result = await spawnPromise("docker-compose", ["up", "-d"], {cwd: repoPath});
        console.log(result);
        if (result.status === "success") {
            return res.status(200).json({ status: "success", message: result.message })
        } else {
            return res.status(500).json({ status: "error", message: result.message })
        }
    } else {
        console.log("docker-compose file does not exist");
        const build = await buildDocker(repoPath, imageName);
        const port = await runDocker(imageName, foundProject.entry_port);

        if (build.status === "success") {
            res.status(200).json({ status: "success", message: build.message, port: port });
        } else {
            res.status(500).json({ status: "error", message: build.message });
        }
    }
});


router.post("/stop", async (req, res) => {
    const { id } = req.body;
    const repos = db.collection("repos");
    const foundRepo = await repos.findOne({ _id: new ObjectId(id) });
    if (!foundRepo) {
        return res.sendStatus(403);
    }
    const imageName = foundRepo.name;
    const result = await stopDocker(imageName);
    return res.json({ status: result.status, message: result.message }).status(200);
});

router.post("/remove", async (req, res) => {
    const { id } = req.body;
    const repos = db.collection("repos");
    const foundRepo = await repos.findOne({ _id: new ObjectId(id) });
    if (!foundRepo) {
        return res.sendStatus(403);
    }

    const repoPath = `${REPO_BASE_URL}/${foundRepo.id}`;
    try{
        if(process.platform === "win32"){
            await exec(`rmdir /s /q ${repoPath}`);
        }
        else if(process.platform === "linux"){
            await exec(`rm -rf ${repoPath}`);
        }
        await repos.deleteOne({ _id: id });
    }
    catch(error){
        console.error(error);
        return res.sendStatus(500);
    }
    const imageName = foundRepo.name;
    
    const { stdout, stderr } = await exec(`docker rm ${imageName}`);
    console.log("stderr:", stderr);
    console.log("stdout:", stdout);
    res.sendStatus(200);
});


module.exports = router;
