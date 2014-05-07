'use strict';

var AWS = require('aws-sdk');


var dynoInstance;
var items;
var output = [];
var delimiter;
var outputArray;
var attributesToGet;

function query(params, callback) {


    dynoInstance.query(params, function(err, data) {


        if (!err) {

            output = output.concat(data.Items);

            // if there is more data we need to keep fetching

            params.ExclusiveStartKey = data.LastEvaluatedKey;

            query(params, function(err, done) {

                if (done) {
                    callback(err, true);
                }


            });


        } else {
            callback(err, true);
        }

    });



}

function toCSV(dynoItems, callback) {


    var csvArray = [];

    //foreach row

    dynoItems.forEach(function(row) {

        var rowArray = [];

        attributesToGet.forEach(function(key) {
            var theType;
            var value;
            try {
              theType = Object.keys(row[key]).join();
              value = row[key][Object.keys(row[key])[0]];

            } catch(exception) {
               theType = 'S';
               value = '';
            }

             if (theType === 'N') {
                 value = Number(value);
             } else {
                 value = '"'+value+'"';
             }



             rowArray.push(value);

        });
         var joined = rowArray.join();

        //process the row array and put it into the CSV array
        csvArray.push(joined);


    });


    callback(csvArray);




}

exports.describe = function(tableName, callback) {


    var params = {
        TableName: tableName
    };

    dynoInstance.describeTable(params, function(err, data) {

        callback(err, data);

    });


};

exports.configure =  function(configuration) {

    // if credentials have been passed in, lets check them and instantiate some objects
    if (configuration.hasOwnProperty('credentials')) {

        var config = new AWS.Config(configuration.credentials);

        dynoInstance = new AWS.DynamoDB(config);



        // if a dyno instance is used instead of us setting it up
    } else if (configuration.hasOwnProperty('dynamodbInstance')) {

        if (configuration.dynamodbInstance instanceof AWS.DynamoDB) {
            dynoInstance = configuration.dynamodbInstance;
        } else {
            throw new Error('Instance is not of type AWS.DynamoDB');
        }

    } else {
        throw new Error('Unable to configure with valid DynamoDB Instance');
    }


};

exports.exportData = function(params, callback) {

    attributesToGet = params.AttributesToGet.sort();

    query(params, function(err, done) {

        if (done) {

            toCSV(output, function(data) {

                outputArray = data;
                callback(true);

            });
        }


    });


};

exports.prettyPrint = function() {
    outputArray.unshift(attributesToGet.join());
    outputArray.forEach(function(row) {
       console.log(row);
    });

};

exports.aliasAttributes = function(query) {

};