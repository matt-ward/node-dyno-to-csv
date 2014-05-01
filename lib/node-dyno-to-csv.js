'use strict';

var AWS = require('aws-sdk');


var dynoInstance;

exports.configure =  function(dynamodbInstance) {

    if (dynamodbInstance instanceof AWS.DynamoDB) {
        dynoInstance = dynamodbInstance;
    } else {
        throw new Error('Instance is not of type AWS.DynamoDB');
    }

}

exports.exportData = function(query) {

    return null;
}

exports.aliasAttributes = function(query) {

}