// Imports
const https = require('https');

const USER_NAME = 'mike@clearcontent.net';
const PW = 'Signnow2323';
const COMMON_REQUEST_OPTIONS = {
    host: "api-eval.signnow.com",
    port: 443,
    headers: {
        "Authorization": ""
    }
}
let ACCESS_TOKEN = '';

// Get Auth token 
getAuthToken = (callback) => {

    let options = Object.assign(COMMON_REQUEST_OPTIONS);
    let data = `username=${USER_NAME}&password=${PW}&grant_type=password`;

    options.method = "POST";
    options.path = "/oauth2/token";
    options.headers.Authorization = "Basic Og==";
    options.headers['Content-Type'] = "application/x-www-form-urlencoded";
    options.headers['Content-Length'] = Buffer.byteLength(data);

    var req = https.request(options, res => {
        res.setEncoding('utf8');
        res.on('data', chunk  => {
            chunk = JSON.parse(chunk);
            var errors = chunk.errors;
            ACCESS_TOKEN = chunk.access_token;
            if (callback) { return callback(errors, chunk); }
        });
    });

    req.on('error', e => {
        if (callback) {
            return callback(e.message);
        }
    });

    req.write(data);
    req.end();

};

// Get signing link for a template
createSigningLink = (documentId, callback) => {

    let options = Object.assign(COMMON_REQUEST_OPTIONS);

    options.method = "POST";
    options.headers.Authorization = `Bearer ${ACCESS_TOKEN}`;
    options.path = "/link";

    options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    let data = `document_id=${documentId}`;
    options.headers['Content-Length'] = Buffer.byteLength(data);

    let req = https.request(options, res => {
        let data = "";

        res.setEncoding('utf8');

        res.on('data', chunk => {
            chunk = JSON.parse(chunk);
            var errors = chunk.errors;
            ACCESS_TOKEN = chunk.access_token;
            if (callback) { return callback(errors, chunk); }
        });
    });

    req.on('error', e => {
        if (callback) {
            return callback(e.message);
        }
    });

    req.write(data);
    req.end();
};

// Get signing link for a template. Fetches access token if not already available
exports.getSigningLink = (documentId, callback) => {

    // Access token already available and valid
    if (ACCESS_TOKEN) {
        createSigningLink(documentId, callback);
    }
    else {
        getAuthToken((err, result) => {
            if (err) {
                console.log("getAuthToken ERROR=", err);
                return callback(err);
            } else {
                console.log(" getAuthToken RESULT=", result);
                createSigningLink(documentId, (err, result) => {
                    if (err) {
                        console.log("createSigningLink ERROR=", err);
                        console.log("documentId=", documentId);
                        return callback(err);
                    } else {
                        console.log("createSigningLink RESULT=", result);
                        return callback(null, result);
                    }
                });
            }
        })
    }
};


