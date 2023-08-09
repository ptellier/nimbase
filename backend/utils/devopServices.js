const { exec: execWithCallback } = require("child_process");
const { promisify } = require("util");
const exec = promisify(execWithCallback);
const fs = require("fs");
const YAML = require("yaml");

DOMAIN_NAME = process.env.HOSTNAME;
REPO_BASE_URL = "repos";
TRAEFIK_DOCKER_COMPOSE_FILE = "../../../docker-compose-traefik-inner.yml";

// clone the repository as project_name
async function cloneRepo(github_link, project_name) {
  try {
    if (fs.existsSync(`${REPO_BASE_URL}/${project_name}`)) {
      if (process.platform === "win32") {
        console.log("repo already exists, overwriting");
        await exec(`rmdir "${REPO_BASE_URL}/${project_name}" /s /q`);
      } else if (process.platform === "linux") {
        console.log("repo already exists, overwriting");
        await exec(`rm -rf "${REPO_BASE_URL}/${project_name}"`);
      }
    }
    const { stdout, stderr } = await exec(
      `git clone ${github_link} ${REPO_BASE_URL}/${project_name}`
    );
    console.log("Repo cloned/pulled");
    return {
      status: "success",
      message: "Repo cloned/pulled",
    };
  } catch (error) {
    return {
      status: "error",
      message: error,
    };
  }
}

// Initialize env file
async function envFileWrite(env_variables, project_name) {
  fs.writeFileSync(
    `${REPO_BASE_URL}/${project_name}/.env`,
    env_variables,
    function (err) {
      if (err) {
        return {
          status: "error",
          message: err,
        };
      }
      return {
        status: "success",
        message: "Environment file is created successfully.",
      };
    }
  );
}

// Analyze services
async function analyzeServices(project_name) {
  try {
    const fileExists = fs.existsSync(
      `${REPO_BASE_URL}/${project_name}/docker-compose.yml`
    );
    if (!fileExists) {
      console.log("docker-compose file does not exist");
      return {
        status: "error",
        message: "docker-compose file does not exist",
      };
    }

    const dockercompose = fs.readFileSync(
      `${REPO_BASE_URL}/${project_name}/docker-compose.yml`,
      "utf8"
    );
    const doc = YAML.parse(dockercompose);
    const services = Object.keys(doc.services);
    return {
      status: "success",
      message: "Services analyzed successfully",
      services: services,
    };
  } catch (error) {
    return {
      status: "error",
      message: error,
      services: [],
    };
  }
}

// configure docker compose files for traefik and project
async function configureDockerComposeFiles(project_name, config_services) {
  const { client, server, connection_url } = config_services;
  try {
    const fileExists = fs.existsSync(
      `${REPO_BASE_URL}/${project_name}/docker-compose.yml`
    );
    if (!fileExists) {
      console.log("docker-compose file does not exist");
      return {
        status: "error",
        message: "docker-compose file does not exist",
      };
    }

    const project_dockercompose = fs.readFileSync(
      `${REPO_BASE_URL}/${project_name}/docker-compose.yml`,
      "utf8"
    );

    const projectDoc = YAML.parse(project_dockercompose);
    let services = Object.keys(projectDoc.services);
    for (const service of services) {
      if (service === client) {
        projectDoc.services[`${project_name}_${service}`] =
          projectDoc.services[service];
        delete projectDoc.services[service];
      } else if (service === server) {
        projectDoc.services[`${project_name}_${service}`] =
          projectDoc.services[service];
        delete projectDoc.services[service];
      }
    }
    services = Object.keys(projectDoc.services);

    for (const service of services) {
      if (service === `${project_name}_${client}`) {
        projectDoc.services[service].labels = [
          "traefik.enable=true",
          "traefik.proxy=inner",
          `traefik.http.routers.${service}.rule=Host(\`${project_name}.${DOMAIN_NAME}\`)`,
          `traefik.http.routers.${service}.entrypoints=https`,
          `traefik.http.routers.${service}.tls.certresolver=dns-cloudflare`,
        ];
      } else if (service === `${project_name}_${server}`) {
        projectDoc.services[service].labels = [
          "traefik.enable=true",
          "traefik.proxy=inner",
          `traefik.http.routers.${service}.rule=(Host(\`${project_name}.${DOMAIN_NAME}\`) && PathPrefix(\`${connection_url}\`))`,
          `traefik.http.routers.${service}.middlewares=${service}-stripprefix`,
          `traefik.http.middlewares.${service}-stripprefix.stripprefix.prefixes=${connection_url}`,
          `traefik.http.routers.${service}.entrypoints=https`,
          `traefik.http.routers.${service}.tls.certresolver=dns-cloudflare`,
        ];
      } else {
        projectDoc.services[service].labels = [
          "traefik.enable=true",
          "traefik.proxy=inner",
          `traefik.http.routers.${service}.entrypoints=https`,
          `traefik.http.routers.${service}.tls.certresolver=dns-cloudflare`,
        ];
      }
    }

    projectDoc.networks = {
      default: {
        name: `${project_name}_traefik_proxy`,
      },
    };

    const yamlString = YAML.stringify(projectDoc);
    fs.writeFileSync(
      `${REPO_BASE_URL}/${project_name}/docker-compose-traefik.yml`,
      yamlString,
      function (err) {
        if (err) throw err;
        console.log("docker-compose-traefik file is created successfully.");
      }
    );

    const traefik_dockercompose = fs.readFileSync(
      TRAEFIK_DOCKER_COMPOSE_FILE,
      "utf8"
    );
    const traefikDoc = YAML.parse(traefik_dockercompose);

    if (
      traefikDoc.networks &&
      traefikDoc.networks.hasOwnProperty(`${project_name}_traefik_proxy`)
    ) {
      delete traefikDoc.networks[`${project_name}_traefik_proxy`];
    }
    traefikDoc.networks = {
      ...traefikDoc.networks,
      [`${project_name}_traefik_proxy`]: {
        external: true,
      },
    };

    // replace the proxy if it already exists in the networks list of the service
    if (
      Array.isArray(traefikDoc.services["traefik_inner"].networks) &&
      traefikDoc.services["traefik_inner"].networks.includes(
        `${project_name}_traefik_proxy`
      )
    ) {
      traefikDoc.services["traefik_inner"].networks = traefikDoc.services[
        "traefik_inner"
      ].networks.filter(
        (network) => network !== `${project_name}_traefik_proxy`
      );
    }
    traefikDoc.services["traefik_inner"].networks = [
      ...(Array.isArray(traefikDoc.services["traefik_inner"].networks)
        ? traefikDoc.services["traefik_inner"].networks
        : []),
      `${project_name}_traefik_proxy`,
    ];

    const traefikYamlString = YAML.stringify(traefikDoc);
    fs.writeFileSync(
      TRAEFIK_DOCKER_COMPOSE_FILE,
      traefikYamlString,
      function (err) {
        if (err) throw err;
        console.log("docker-compose-traefik file is created successfully.");
      }
    );
    return {
      status: "success",
      message: "Docker compose files configured successfully",
    };
  } catch (error) {
    return {
      status: "error",
      message: error,
    };
  }
}

// deploy docker compose file
async function deployDocker(project_name) {
  const { stdout: stdout4, stderr: stderr4 } = await exec(
    `docker-compose -f "${TRAEFIK_DOCKER_COMPOSE_FILE}" -p "inner" down`
  );

  const dockerComposeFile = `${REPO_BASE_URL}/${project_name}/docker-compose-traefik.yml`;
  const { stdout: stdout1, stderr: stderr1 } = await exec(
    `docker-compose -f ${dockerComposeFile} down`
  );
  const { stdout: stdout2, stderr: stderr2 } = await exec(
    `docker-compose -f ${dockerComposeFile} up -d --build`
  );
  const { stdout: stdout3, stderr: stderr3 } = await exec(
    `docker system prune -f`
  );

  const { stdout: stdout5, stderr: stderr5 } = await exec(
    `docker-compose -f "${TRAEFIK_DOCKER_COMPOSE_FILE}" -p "inner" up -d`
  );

  return {
    status: "success",
    message: "Docker image deployed",
    url: `http://${project_name}.${DOMAIN_NAME}`,
  };
}

// remove a project
async function removeProject(project_name) {
  const dockercompose = `${REPO_BASE_URL}/${project_name}/docker-compose-traefik.yml`;
  const fileExists = fs.existsSync(dockercompose);
  if (!fileExists) {
    console.log("docker-compose file does not exist");
    fs.rmdirSync(`${REPO_BASE_URL}/${project_name}`, { recursive: true });
    return {
      status: "success",
      message: "docker-compose file does not exist, so removed the project",
    };
  }
  try {
    const { stdout: stdout0, stderr: stderr0 } = await exec(
      `docker-compose -f "${TRAEFIK_DOCKER_COMPOSE_FILE}" -p "inner" down`
    );
    const { stdout: stdout1, stderr: stderr1 } = await exec(
      `docker-compose -f ${dockercompose} down`
    );
    fs.rmdirSync(`${REPO_BASE_URL}/${project_name}`, { recursive: true });
    const traefik_dockercompose = fs.readFileSync(
      TRAEFIK_DOCKER_COMPOSE_FILE,
      "utf8"
    );
    const traefikDoc = YAML.parse(traefik_dockercompose);
    if (
      traefikDoc.networks &&
      traefikDoc.networks.hasOwnProperty(`${project_name}_traefik_proxy`)
    ) {
      delete traefikDoc.networks[`${project_name}_traefik_proxy`];
    }
    if (
      Array.isArray(traefikDoc.services["traefik_inner"].networks) &&
      traefikDoc.services["traefik_inner"].networks.includes(
        `${project_name}_traefik_proxy`
      )
    ) {
      traefikDoc.services["traefik_inner"].networks = traefikDoc.services[
        "traefik_inner"
      ].networks.filter(
        (network) => network !== `${project_name}_traefik_proxy`
      );
    }
    const traefikYamlString = YAML.stringify(traefikDoc);
    fs.writeFileSync(
      TRAEFIK_DOCKER_COMPOSE_FILE,
      traefikYamlString,
      function (err) {
        if (err) throw err;
        console.log(
          "docker-compose-inner-traefik file is updated successfully."
        );
      }
    );
    const { stdout: stdout2, stderr: stderr2 } = await exec(
      `docker-compose -f "${TRAEFIK_DOCKER_COMPOSE_FILE}" -p "inner" up -d`
    );
    return {
      status: "success",
      message:
        "Docker image stopped, repo cleared, traefik reconfigured and started",
    };
  } catch (error) {
    return {
      status: "error",
      message: error,
    };
  }
}

module.exports = {
  cloneRepo,
  envFileWrite,
  analyzeServices,
  configureDockerComposeFiles,
  deployDocker,
  removeProject,
};
