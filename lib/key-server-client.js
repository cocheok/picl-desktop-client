const xhrequest = require('xhrequest');
const L = require('logger');
const config = require('config');
var DEFAULT_SERVER_ROOT;
if (config.LOCAL_SERVERS) DEFAULT_SERVER_ROOT = "http://127.0.0.1:8090";
else DEFAULT_SERVER_ROOT = "http://107.21.150.42";
const USER_PATH = "/user"

function handleError(error) {
  if (error.json) throw error.json;
  else throw { code: error.status, error: error.statusText, message: error.text };
}

function KeyServerClient(options) {
  options = options || {};
  this.serverRoot = options.serverRoot || DEFAULT_SERVER_ROOT;
};

// POST /user
// Valid args include:
//   - email:string User's email (required)
KeyServerClient.prototype.createUser = function(args) {
  var content = {};
  args = args || {};
  if (args.assertion) content.assertion = args.assertion;
  else if (args.email) content.email = args.email;
  return xhrequest(this.serverRoot+USER_PATH, { method: 'POST', content: content }).
  then(function (response) {
    if (!response.json) throw "KeyServerClient.createUser: Empty response";
    return response.json;
  }).
  then(null, function (err) {
    handleError(err);
  });
}

// GET /user/?email=<email>
// Valid args include:
//   - email:string User's email (required)
KeyServerClient.prototype.getUser = function(args) {
  var content = {};
  args = args || {};
  if (args.assertion) content.assertion = args.assertion;
  else if (args.email) content.email = args.email;
  return xhrequest(this.serverRoot+USER_PATH+"/", { method: 'GET', content: content }).
  then(function (response) {
    if (!response.json) throw "KeyServerClient.getUser: Empty response";
    return response.json;
  }).
  then(null, function (err) {
    handleError(err);
  });
}

module.exports = KeyServerClient;