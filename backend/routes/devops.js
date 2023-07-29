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

const YAML = require('yaml');

DOMAIN_NAME = "localhost";
DEFAULT_EXPOSED_PORT = 3000;
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
        // check if docker-compose file exists
        const fileExists = fs.existsSync(`${REPO_BASE_URL}/${name}/docker-compose.yml`);
        if(!fileExists){
            console.log("docker-compose file does not exist");
            return {
                status: "error",
                message: "docker-compose file does not exist",
            };
        } 

        //read and parse the docker-compose file
        const dockercompose = fs.readFileSync(`${REPO_BASE_URL}/${name}/docker-compose.yml`, 'utf8');
        const doc = YAML.parse(dockercompose);
        console.log(doc);
        //get names of services
        const services = Object.keys(doc.services);
        console.log(services);
        return services;
    } catch (error) {
        console.error(`exec error: ${error}`);
        throw error;
    }
}

async function deployDocker(id, repoPath, connection_url, client, server) {
    // get the docker-compose file
    const dockercompose = fs.readFileSync(`${repoPath}/docker-compose.yml`, 'utf8');
    const doc = YAML.parse(dockercompose);
    let services = Object.keys(doc.services);
    // replace the service name with id_service
    for (const service of services) {
        doc.services[`${id}_${service}`] = doc.services[service];
        delete doc.services[service];
    }
    services = Object.keys(doc.services);
    // remove the ports
    for (const service of services) {
        delete doc.services[service].ports;
    }
    //convert env variables to json object
    const env_variables = fs.readFileSync(`${repoPath}/.env`, 'utf8');
    const env_vars = env_variables.split("\n");
    const env_json = {};
    for (const variable of env_vars) {
        const key_value = variable.split("=");
        env_json[key_value[0]] = key_value[1];
    }
    
    // add the environment variables
    // for (const service of services) {
    //     //replace the template variables with actual values
    //     for (const key of Object.keys(env_json)) {
    //         doc.services[service].environment[key] = env_json[key].replace(/{{id}}/g, id);
    //     }
    // }
    // add traefik labels
    for (const service of services) {
        // console.log(service);
        // console.log(`${id}_${client}`);
        //find the client service
        if (service === `${id}_${client}`) {
            doc.services[service].labels = [
                "traefik.enable=true",
                `traefik.http.routers.${service}.rule=Host(\`${id}.${DOMAIN_NAME}\`)`,
            ];
        }
        //find the server service
        else if (service === `${id}_${server}`) {
            doc.services[service].labels = [
                "traefik.enable=true",
                `traefik.http.routers.${service}.rule=(Host(\`${id}.${DOMAIN_NAME}\`) && PathPrefix(\`${connection_url}\`))`,
                `traefik.http.routers.${service}.middlewares=${service}-stripprefix`,
                `traefik.http.middlewares.${service}-stripprefix.stripprefix.prefixes=${connection_url}`,
            ];
        }
    }

    // add the traefik network
    doc.networks = {
        default:
        {
            external:
            {
                name: "traefik_default"
            }
        }
    };


    // write the docker-compose file
    const yamlString = YAML.stringify(doc);
    // save the docker-compose file as docker-compose-traefik.yml
    fs.writeFileSync(`${repoPath}/docker-compose-traefik.yml`, yamlString, function (err) {
        if (err) throw err;
        console.log("docker-compose-traefik file is created successfully.");
    }
    );
    
    // run docker-compose up
    const { stdout, stderr } = await exec(`docker-compose -f ${repoPath}/docker-compose-traefik.yml up -d`);
    console.log("stderr:", stderr);
    console.log("stdout:", stdout);
    return { status: "success", message: "Docker image deployed" , "url": `${id}.${DOMAIN_NAME}`};

}

// async function runDocker(imagename,user_port) {
//     console.log("Running docker image");
//     let check = DEFAULT_EXPOSED_PORT;
//     if (process.platform === "win32") {
//         console.log("win32");
//         while (true) {
//             check = Math.floor(Math.random() * 1000) + 3000;
//             console.log("checking port : ", check);
//             const { stdout: port, stderr } = await exec(
//                 `netstat -ano | findstr :${check} | findstr LISTENING | sort /R`
//             );
//             if (port === "") {
//                 console.log("port available : ", check);
//                 break;
//             }
//             console.log("stderr:", stderr);
//             console.log("port already in use : ", port);
//         }
//     } else if (process.platform === "linux") {
//         console.log("linux");
//         while (true) {
//             check = Math.floor(Math.random() * 1000) + 3000;
//             console.log("checking port : ", check);
//             const { stdout: port, stderr } = await exec(
//                 `netstat -antp 2>/dev/null | grep :${check}`
//             );
//             if (port === "") {
//                 console.log("port available : ", check);
//                 break;
//             }
//             console.log("stderr:", stderr);
//             console.log("port already in use : ", port);
//         }
//     }
//     await exec(`docker run -d -p ${check}:${user_port} ${imagename}`);
//     console.log("Docker image running");
//     return check;
// }

async function stopDocker(imagename) {
    let containerId = "";
    if(process.platform === "win32" || process.platform === "linux"){
        const { stdout, stderr } = await exec(
            `docker ps --filter ancestor=${imagename} --format "{{.ID}}"`
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
    let { link, name, env_variables } = req.body;
    link = link.trim();
    console.log(link + "::" + name + "::" + env_variables);
    const repos = db.collection("repos");
    await repos.updateOne(
        { link: link },
        {
            $set: {
                link: link,
                name: name,
                env_variables: env_variables,
            },
        },
        { upsert: true}
    );
    const item = await repos.findOne({ link: link });
    try {
        const name = await cloneRepo(item.link, item._id, item.env_variables);
        return res.status(200).json({ name: name , id: item._id});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error });
    }
});

router.post("/deploy", async (req, res) => {
    const { id, connection_url, client, server } = req.body;
    const repos = db.collection("repos");
    const foundRepo = await repos.findOne({ _id: new ObjectId(id) });
    if (!foundRepo) {
        return res.sendStatus(403); 
    }
    // console.log(foundRepo);
    const repoPath = `${REPO_BASE_URL}/${id}`;
    try{
        const result = await deployDocker(id, repoPath, connection_url, client, server);
        return res.json({ status: result.status, message: result.message, url: result.url }).status(200);
    }
    catch(error){
        console.error(error);
        return res.sendStatus(500);
    }
});


router.post("/stop", async (req, res) => {
    const { id } = req.body;
    const repos = db.collection("repos");
    const foundRepo = await repos.findOne({ _id: new ObjectId(id) });
    if (!foundRepo) {
        return res.sendStatus(403);
    }
    const imagename = foundRepo.name;
    const result = await stopDocker(imagename);
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
    const imagename = foundRepo.name;
    
    const { stdout, stderr } = await exec(`docker rm ${imagename}`);
    console.log("stderr:", stderr);
    console.log("stdout:", stdout);
    res.sendStatus(200);
});


module.exports = router;
