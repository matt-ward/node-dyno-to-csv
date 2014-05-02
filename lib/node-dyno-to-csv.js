'use strict';

var AWS = require('aws-sdk');


var dynoInstance;
var items;
var output;
var delimiter;

function query(params) {

	dynoInstance.query(params, function(err, data) {

		if (data) {
			items.push(data.Items);

			// if there is more data we need to keep fetching
			if (Object.keys(data.LastEvalutedKey).length !== 0) {

				query(params);

			}

		}

	});

}

function toCSV(dynoItems) {


}

exports.configure =  function(dynamodbInstance, dynoParams, s3Instance, s3Params) {

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