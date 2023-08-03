//Enumeration for the different states of the deploy button
export const deployState = {
  NOT_CLONED: 0,
  CLONING: 1,
  CLONED: 2,
  CLONE_FAILED: 3,
  DEPLOYING: 4,
  DEPLOYED: 5,
  DEPLOY_FAILED: 6,
}
Object.freeze(deployState);