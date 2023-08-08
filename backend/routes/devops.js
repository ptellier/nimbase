// const express = require("express");
// const db = require("../database/dbConn.js");
// const router = express.Router();
// import {cloneRepo, envFileWrite,  analyzeServices,  configureDockerComposeFiles,  deployDocker,  removeProject} from "../utils/devopServices.js";

// router.post("/create", async (req, res) => {
//   console.log("Cloning repo");
//   let { github_url, name, env_vars, _id } = req.body;
//   github_url = github_url.trim();
//   try {
//     console.log(`Cloning project ${name}`);
//     const services = await cloneRepo(github_url, _id, env_vars);
//     return res.status(200).json({
//       status: "success",
//       message: `successfully cloned project ${name}`,
//       services: services,
//       id: _id,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ status: "error", message: error });
//   }
// });

// router.post("/deploy", async (req, res) => {
//   const { id, configs } = req.body;
//   const { connection_url, client, server } = configs;
//   const repos = db.collection("projects");
//   // append extra configs to mongodb
//   const foundRepo = await repos.findOneAndUpdate(
//     { _id: new ObjectId(id) },
//     {
//       $set: {
//         connection_url: connection_url,
//         client: client,
//         server: server,
//       },
//     },
//     { returnOriginal: false }
//   );

//   const repoPath = `${REPO_BASE_URL}/${id}`;
//   try {
//     const result = await deployDocker(
//       id,
//       repoPath,
//       connection_url,
//       client,
//       server
//     );
//     const updateRepo = await repos.findOneAndUpdate(
//       { _id: new ObjectId(id) },
//       { $set: { url: result.url } },
//       { returnOriginal: false }
//     );
//     return res
//       .json({
//         status: "success",
//         message: result.message,
//         url: result.url,
//       })
//       .status(200);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ status: "error", message: error });
//   }
// });

// router.post("/remove", async (req, res) => {
//   const { id } = req.body;
//   const dockercompose = `${REPO_BASE_URL}/${id}/docker-compose-traefik.yml`;
//   try {
//     const { stdout, stderr } = await exec(
//       `docker-compose -f ${dockercompose} stop && docker-compose -f ${dockercompose} rm -f`
//     );
//     console.log("stderr:", stderr);
//     console.log("stdout:", stdout);

//     // clear the repo
//     fs.rmdirSync(`${REPO_BASE_URL}/${id}`, { recursive: true });
//     return res
//       .json({
//         status: "success",
//         message: "Docker image stopped and repo cleared",
//       })
//       .status(200);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ status: "error", message: error });
//   }
// });

// module.exports = router;
