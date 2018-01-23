// Imports
const $ = require('jquery');
const express = require('express');
const SignNowClient = require('./sign-now-client');

let app = express();
const port = process.env.PORT || 3000;

const TEMPLATE_ID = '539530f42acbe2f9458c15ccad57698f90fa32b8';

// Route for public data
app.use(express.static('public'));

// Root route
app.use('/', function (req, res, next) {
    
    console.log('Request Url:' + req.url);    

    SignNowClient.getSigningLink( TEMPLATE_ID, (err, result) => {
        if (!err) {
            console.log("RESULTS=", result);
            let responseHTML = '<html lang=en><title>SignNow POC</title><meta charset=utf-8><meta content="width=device-width,initial-scale=1"name=viewport><link href=https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css rel=stylesheet><script src=https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js></script><script src=https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js></script><div class=container><div class=modal id=myModal style=display:block><div class=modal-dialog><div class=modal-content><div class=modal-header><h4 class="text-center modal-title">Click on this button to sign a document</h4></div><div class="text-center modal-body"><a class="btn btn-primary"href=XXX_DOC_URL_XXX target=_blank>Sign Document</a></div></div></div></div></div>';
            responseHTML = responseHTML.replace("XXX_DOC_URL_XXX", result.url_no_signup);
        
            res.send(responseHTML);
        
            next();
                    
        } else {
            console.log("ERROR=", err);
            res.send('error');
        }
    });
});

app.listen(port);