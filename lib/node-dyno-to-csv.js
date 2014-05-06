'use strict';

var AWS = require('aws-sdk');


var dynoInstance;
var items;
var output = [];
var delimiter;

function query(params, callback) {


	dynoInstance.query(params, function(err, data) {


		if (!err) {

            output = output.concat(data.Items);

			// if there is more data we need to keep fetching

			//if (data.LastEvalutedKey !== undefined) {

                params.ExclusiveStartKey = data.LastEvaluatedKey;
                console.log(params);
                query(params, function(err, done) {

                    if (done) {
                        callback(err, true);
                    }


                });

			//}


		} else {
            callback(err, true);
        }


       // callback(true);

	});



}

function toCSV(dynoItems) {


}

exports.describe = function(tableName, callback) {


      var params = {
          TableName: tableName
      }

      dynoInstance.describeTable(params, function(err, data) {

          callback(err, data);

      });


}

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


}

exports.exportData = function(params, callback) {



    query(params, function(err, done) {


            console.log(err);
            callback(output);


    });


}

exports.aliasAttributes = function(query) {

}