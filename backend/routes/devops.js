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
const { spawn } = require("child_process");
const ObjectId = require("mongodb").ObjectId;

const YAML = require("yaml");

DOMAIN_NAME = process.env.HOSTNAME;
DEFAULT_EXPOSED_PORT = 3000;
REPO_BASE_URL = "repos";

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
        const fileExists = fs.existsSync(
            `${REPO_BASE_URL}/${name}/docker-compose.yml`
        );
        if (!fileExists) {
            console.log("docker-compose file does not exist");
            return {
                status: "error",
                message: "docker-compose file does not exist",
            };
        }

        //read and parse the docker-compose file
        const dockercompose = fs.readFileSync(
            `${REPO_BASE_URL}/${name}/docker-compose.yml`,
            "utf8"
        );
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
    const dockercompose = fs.readFileSync(
        `${repoPath}/docker-compose.yml`,
        "utf8"
    );
    const doc = YAML.parse(dockercompose);
    let services = Object.keys(doc.services);
    // replace the service name with id_service
    for (const service of services) {
        if (service === client) {
            doc.services[`${id}_${service}`] = doc.services[service];
            delete doc.services[service];
        }
    }
    services = Object.keys(doc.services);
    // remove the ports
    for (const service of services) {
        delete doc.services[service].ports;
    }

    for (const service of services) {
        if (service === `${id}_${client}`) {
            if (DOMAIN_NAME === "localhost") {
                doc.services[service].labels = [
                    "traefik.enable=true",
                    `traefik.http.routers.${service}.rule=Host(\`${id}.${DOMAIN_NAME}\`)`,
                ];
            } else {
                doc.services[service].labels = [
                    "traefik.enable=true",
                    `traefik.http.routers.${service}.rule=Host(\`${id}.${DOMAIN_NAME}\`)`,
                    `traefik.http.routers.${service}.entrypoints=https`,
                    `traefik.http.routers.${service}.tls.certresolver=dns-cloudflare`,
                ];
            }
        }
        //find the server service
        else if (service === server) {
            if (DOMAIN_NAME === "localhost") {
                doc.services[service].labels = [
                    "traefik.enable=true",
                    `traefik.http.routers.${service}.rule=(Host(\`${id}.${DOMAIN_NAME}\`) && PathPrefix(\`${connection_url}\`))`,
                    `traefik.http.routers.${service}.middlewares=${service}-stripprefix`,
                    `traefik.http.middlewares.${service}-stripprefix.stripprefix.prefixes=${connection_url}`,
                ];
            } else {
                doc.services[service].labels = [
                    "traefik.enable=true",
                    `traefik.http.routers.${service}.rule=(Host(\`${id}.${DOMAIN_NAME}\`) && PathPrefix(\`${connection_url}\`))`,
                    `traefik.http.routers.${service}.middlewares=${service}-stripprefix`,
                    `traefik.http.middlewares.${service}-stripprefix.stripprefix.prefixes=${connection_url}`,
                    `traefik.http.routers.${service}.entrypoints=https`,
                    `traefik.http.routers.${service}.tls.certresolver=dns-cloudflare`,
                ];
            }
        } else {
            if (DOMAIN_NAME === "localhost") {
                doc.services[service].labels = ["traefik.enable=true"];
            } else {
                doc.services[service].labels = [
                    "traefik.enable=true",
                    `traefik.http.routers.${service}.entrypoints=https`,
                    `traefik.http.routers.${service}.tls.certresolver=dns-cloudflare`,
                ];
            }
        }
    }

    // add the traefik network
    doc.networks = {
        default: {
            name: `${id}_traefik_proxy`,
        },
    };

    // write the docker-compose file
    const yamlString = YAML.stringify(doc);
    // save the docker-compose file as docker-compose-traefik.yml
    fs.writeFileSync(
        `${repoPath}/docker-compose-traefik.yml`,
        yamlString,
        function (err) {
            if (err) throw err;
            console.log("docker-compose-traefik file is created successfully.");
        }
    );

    const { stdout: stdout1, stderr: stderr1 } = await exec(
        `docker-compose -f ${repoPath}/docker-compose-traefik.yml down`
    );
    const { stdout: stdout2, stderr: stderr2 } = await exec(
        `docker-compose -f ${repoPath}/docker-compose-traefik.yml up -d --build`
    );
    const { stdout: stdout3, stderr: stderr3 } = await exec(
        `docker system prune -f`
    );

    console.log("stderr:", stderr2);
    console.log("stdout:", stdout2);

      
      const traefikCompose = fs.readFileSync(
        `../../docker-compose-traefik.yml`,
        "utf8"
      );
      
      const traefikDoc = YAML.parse(traefikCompose);
      
      if (traefikDoc.networks && traefikDoc.networks.hasOwnProperty(`${id}_traefik_proxy`)) {
        delete traefikDoc.networks[`${id}_traefik_proxy`];
      }
      traefikDoc.networks = {
        ...traefikDoc.networks,
        [`${id}_traefik_proxy`]: {
          external: true,
        },
      };
      
      if (DOMAIN_NAME === "localhost") {
        // replace the proxy if it already exists in the networks list of the service
        if (
          Array.isArray(traefikDoc.services["traefik"].networks) &&
          traefikDoc.services["traefik"].networks.includes(`${id}_traefik_proxy`)
        ) {
          traefikDoc.services["traefik"].networks = traefikDoc.services[
            "traefik"
          ].networks.filter((network) => network !== `${id}_traefik_proxy`);
        }
        traefikDoc.services["traefik"].networks = [
          ...(Array.isArray(traefikDoc.services["traefik"].networks)
            ? traefikDoc.services["traefik"].networks
            : []),
          `${id}_traefik_proxy`,
        ];
      } else {
        if (
          Array.isArray(traefikDoc.services["x-common-keys-core"].networks) &&
          traefikDoc.services["x-common-keys-core"].networks.includes(
            `${id}_traefik_proxy`
          )
        ) {
          traefikDoc.services["x-common-keys-core"].networks = traefikDoc.services[
            "x-common-keys-core"
          ].networks.filter((network) => network !== `${id}_traefik_proxy`);
        }
        traefikDoc.services["x-common-keys-core"].networks = [
          ...(Array.isArray(traefikDoc.services["x-common-keys-core"].networks)
            ? traefikDoc.services["x-common-keys-core"].networks
            : []),
          `${id}_traefik_proxy`,
        ];
      }

      
      

    // write the traefik docker-compose file
    const traefikYamlString = YAML.stringify(traefikDoc);
    // save the docker-compose file as docker-compose-traefik.yml
    fs.writeFileSync(
        `../../docker-compose-traefik.yml`,
        traefikYamlString,
        function (err) {
            if (err) throw err;
            console.log("docker-compose-traefik file is created successfully.");
        }
    );

    const { stdout: stdout4, stderr: stderr4 } = await exec(
        `docker-compose -f ../../docker-compose-traefik.yml down`
        `docker-compose -f ../../docker-compose-traefik.yml up -d`
    );
    console.log("stderr:", stderr4);

    return {
        status: "success",
        message: "Docker image deployed",
        url: `http://${id}.${DOMAIN_NAME}`,
    };
}

router.post("/clone", async (req, res) => {
    console.log("Cloning repo");
    let { github_url, name, env_vars, _id } = req.body;
    github_url = github_url.trim();
    try {
        console.log(`Cloning project ${name}`);
        const services = await cloneRepo(github_url, _id, env_vars);
        return res.status(200).json({
            status: "success",
            message: `successfully cloned project ${name}`,
            services: services,
            id: _id,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "error", message: error });
    }
});

router.post("/deploy", async (req, res) => {
    const { id, configs } = req.body;
    const { connection_url, client, server } = configs;
    const repos = db.collection("projects");
    // append extra configs to mongodb
    const foundRepo = await repos.findOneAndUpdate(
        { _id: new ObjectId(id) },
        {
            $set: {
                connection_url: connection_url,
                client: client,
                server: server,
            },
        },
        { returnOriginal: false }
    );

    const repoPath = `${REPO_BASE_URL}/${id}`;
    try {
        const result = await deployDocker(
            id,
            repoPath,
            connection_url,
            client,
            server
        );
        const updateRepo = await repos.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: { url: result.url } },
            { returnOriginal: false }
        );
        return res
            .json({
                status: "success",
                message: result.message,
                url: result.url,
            })
            .status(200);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "error", message: error });
    }
});

router.post("/remove", async (req, res) => {
    const { id } = req.body;
    const dockercompose = `${REPO_BASE_URL}/${id}/docker-compose-traefik.yml`;
    try {
        const { stdout, stderr } = await exec(
            `docker-compose -f ${dockercompose} down`
        );
        console.log("stderr:", stderr);
        console.log("stdout:", stdout);

        // clear the repo
        fs.rmdirSync(`${REPO_BASE_URL}/${id}`, { recursive: true });
        return res
            .json({
                status: "success",
                message: "Docker image stopped and repo cleared",
            })
            .status(200);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "error", message: error });
    }
});

module.exports = router;
