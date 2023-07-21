const { exec: execWithCallback } = require("child_process");
const { promisify } = require("util");
const exec = promisify(execWithCallback);
const fs = require("fs");

ENV_EXPOSED_PORT = 3000;


async function cloneRepo(link, name) {
    try {
        //check if name already exists
        if (fs.existsSync(`repos/${name}`)) {
            if (process.platform === "win32") {
                console.log("repo already exists, overwriting");
                await exec(`rmdir "repos/${name}" /s /q`);
            } else if (process.platform === "linux") {
                console.log("repo already exists, overwriting");
                await exec(`rm -rf "repos/${name}"`);
            }
        }
        const { stdout, stderr } = await exec(
            `git clone ${link} repos/${name}`
        );
        console.log("stderr:", stderr);
    } catch (error) {
        console.error(`exec error: ${error}`);
        throw error;
    }
}

async function buildDocker(repoPath, imagename) {
    
    const { stdout, stderr } = await exec(
        `docker build -t ${imagename} ${repoPath}`
    );
    console.log("Buiilding docker image");
    let check = 3000;
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
    }
    else if (process.platform === "linux") {
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

    console.log("Building docker image");
    // check if docker-compose exists in repo else use dockerfile
    if(fs.existsSync(`${repoPath}/docker-compose.yml`)){
        console.log("docker-compose.yml found");
        await exec(`docker-compose -f ${repoPath}/docker-compose.yml up -d`);
    }
    else{
        console.log("docker-compose.yml not found");
        await exec(`docker run -d -p ${check}:${ENV_EXPOSED_PORT} ${imagename}`);
    }
}



async function main(url, projectName){
    await cloneRepo(url, projectName);
    await buildDocker(`repos/${projectName}`, projectName);
}


main("https://github.com/Aryan-B/demo.git", "demo3");
