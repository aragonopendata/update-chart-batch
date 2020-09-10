/*
#title           :index.js
#description     :This script will make all charts to be updated.
#date            :202002
#version         :1.0.0   
#installation    :npm install #at the same directory
#usage		     :node index.js
#requirement     :nodejs and npm with the java backend server to make the petitions
#==============================================================================
*/

const bent = require('bent');
var api = require('./apiCalls/apiCalls');
var nextId = require('./utils/loadMore');
var log = require('./utils/log');

// Get all the ids of the charts
api.listOfCharts().then(function (results) {
    if (results.statusCode) {
        console.log("Get List error");
        log.error("Get List error");
    } else {
        //Now get the procees of each one and update
        nextId(results);
    }
});
