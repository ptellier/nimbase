validator = require('validator');

function isString(value) {
  return typeof value === 'string' || value instanceof String;
}

function isNumber(value) {
  return typeof value === 'number';
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
  return Object.keys(val).length === 5
    && isString(val.firstName)
    && isString(val.lastName)
    && isString(val.username)
    && validator.isEmail(val.email)
    && isString(val.password)
}

function isProject(val) {
  return Object.keys(val).length === 10
    && isString(val.owner)
    && isString(val.name)
    && isString(val.description)
    && (isString(val.image) || val.image === null)
    && isBoolean(val.public)
    && isString(val.dockerfile)
    && isString(val.github_url)
    && isString(val.github_auth_tokens)
    && isString(val.env_vars)
    && isNumber(val.entry_port)
}

function isProjectPut(val) {
  return Object.keys(val).length === 11
    && validator.isMongoId(val._id)
    && isString(val.owner)
    && isString(val.name)
    && isString(val.description)
    && (isString(val.image) || val.image === null)
    && isBoolean(val.public)
    && isString(val.dockerfile)
    && isString(val.github_url)
    && isString(val.github_auth_tokens)
    && isString(val.env_vars)
    && isNumber(val.entry_port)
}

module.exports = {
  isString,
  isStringArray,
  isObject,
  isEmail,
  isNewUser,
  isProject,
  isProjectPut,
}