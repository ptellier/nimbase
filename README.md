# CPSC 455 Project Progress #1: Project Requirements

###### Group Members: Landseer Enga, Phillip Tellier, Jake Milad, Bhairaw Aryan
###### Github Repo Link: https://github.com/ptellier/nimbase
###### Project name: *Nimbase*

<p align="center">
<img alt="Nimbase icon" src="readme/nimbase_icon.png" width="200px">
</p>

## Project Description

Nimbase is a web application that lets anyone host any application that can be containerized with a docker file.
Simply create an account, give Nimbase a link to your GitHub repository and upload a docker file.
Then Nimbase will build your app, host it, and make it available from anywhere on the internet.

### Project Goals:

##### "minimal" goals
- Interface to sign-in/authenticate users ✅
- Page for users to edit the applications they want to host on our server ✅
- Front-end for users to be able to select a GitHub repo and docker file for making their container ✅
- MongoDB database that stores user account info, GitHub repo links, docker files, and authentication tokens ✅
- Workflow using Node.js/Express.js which clones a GitHub repo, builds an image using the provided dockerfile and repo files, and runs a container created from the image ✅

##### "standard" goals
- "Explore" page for anyone on the Nimbase site to look at all the (publicly) hosted projects (no authentication required). ✅
- Reverse proxy manager redirects users on the internet to the correct containers hosting different web apps. ✅
- Visibility toggle for hosted projects so that users can choose to make their project private or public ✅
- Landing page (no authentication required) that describes Nimbase and its features ✅ 

##### "stretch" goals
- Use a virtual machine from Digital Ocean to host the hosting service along with all its underlying hosted containers ✅
- Teammate system that allows users to add each other to a team for their project ✅
- System for users to create an enterprise in which only they have the authority to add instructors ❌

### Incorporation of Different Technologies

HTML was written as JSX to define the front-end interface and the create-react-app `index-html` was edited to include
metadata like a title and add google fonts. Javascript was written as JSX to define the behaviour of the front-end and
as plain javascript to define the express and node server on the back-end. CSS files were included for each page of 
the React application to define the layout, styling, fonts, spacing, and coloring in harmony with [Chakra UI](https://chakra-ui.com/)
inline styling utilities.

React.js was used on the front-end of the website to create an interface to sign-up, log in, 
create a "project" (a container to be hosted in our service), edit a project's settings, and activate deployment.
Redux was used to store user state globally for the application including the user's JWT access token to access
protected routes.

Node.js and Express.js were used to create a back-end server that handles user authentication and authorization,
CRUD operations for user data, CRUD operations for project data, and the workflow for building and deploying a project.
User authentication (via a login https call) was handled by hashed password comparison of a particular user, 
subsequently sending back an access token JWT and refresh token JWT. Node was used to call command line commands to
(git) clone the repo of a project into the server filesystem, then build images and deploy them with docker commands.

MongoDB stores the data for user accounts, teams of users, and for "projects". For each user in the `user` collection,
we store a username, email, password hash, an array of the id's of the projects the user owns, and a refresh token. 
Each `project` stores a project name, description, whether the project is publicly hosted (and shown on the "explore" page),
a data URI encoded image of the project, a GitHub url, and a URL for the hosted application to access it through the internet.

Nimbase and all its users' containerized applications are hosted on Digital Ocean in a virtual machine. 
Traefik is used as an application load balancer and reverse proxy manager to connect the user applications
to the internet.


### Above and beyond functionality

### Next Steps

- improve Nimbase's security by automating the server to create new secrets for Refresh tokens and Access tokens
  after a period of time.
- verify emails before letting a user create an account
- allow users to sign-in using their email (currently only username sign-in is supported)
- give an option to encrypt environment variables so that users can include secrets in them without risk of them
  being revealed if our database is accessed by a malicious user.
- allow horizontal scaling of Nimbase to support hosting more user applications.

### Team Member Contributions

**Phillip Tellier**: Documentation of requirements, features, and use of technologies. Authentication/Authorization back-end
 end points and login and sign-in front-end pages. CRUD operation back-end end-points for user accounts and `project` collection.
Pages to see all a user's projects, and to edit individual projects.

**Landseer Enga**: Created initial 'explore' page, then primarily worked on the teams feature. Contributed to back-end routes
for all things related to managing teams and their associated members/projects. Helped create front-end feature to allow users to manage teams.