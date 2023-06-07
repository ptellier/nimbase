validator = require('validator');

function isString(value) {
  return typeof value === 'string' || value instanceof String;
}

function isBoolean(value) {
  return value === true || value === false;
}

function isObject(value) {
  return typeof value === 'object' && !Array.isArray(value) && value !== null;
}

function isStringArray(value) {
  return Array.isArray(value) && value.every(isString);
}

function isEmail(value) {
  return validator.isEmail(value);
}

function isNewUser(val) {
  return Object.keys(val).length === 3
    && isString(val.username)
    && validator.isEmail(val.email)
    && isString(val.password_hash)
}

function isProject(val) {
  return Object.keys(val).length === 7
    && isString(val.owner)
    && isString(val.name)
    && isString(val.description)
    && isBoolean(val.public)
    && isString(val.dockerfile)
    && isString(val.github_url)
    && isString(val.github_auth_token)
}

function isProjectPut(val) {
  return Object.keys(val).length === 8
    && isString(val.owner)
    && isString(val.name)
    && isString(val.description)
    && isBoolean(val.public)
    && isString(val.dockerfile)
    && isString(val.github_url)
    && isString(val.github_auth_token)
}

module.exports = {
  isString,
  isStringArray,
  isEmail,
  isNewUser,
  isProject,
  isProjectPut,
}