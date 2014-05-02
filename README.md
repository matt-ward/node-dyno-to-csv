node-dyno-to-csv
================

A NodeJS Module that exports AWS DynamoDB query results to CSV

Usage
------

var dynoToCsv = require('dyno-to-csv');

//configure with our a DynamoDB instance

var AWS = require('aws-sdk');

var dynamoDB = new AWS.DynamoDB();

var dynoConfig = {
	table: 'table-name',
}

dynoToCsv.configure(dynamoDB)