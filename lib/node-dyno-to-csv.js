'use strict';

var AWS = require('aws-sdk');


var dynoInstance;
var s3Instance;
var bucketName;
var bucketLocation;
var items;
var output = [];
var delimiter;
var outputArray;
var attributesToGet;
var limitCounter = 0;
var storage;

function query(params, callback) {


    dynoInstance.query(params, function(err, data) {

        if (typeof data.Items !== "undefined") {
            output = output.concat(data.Items);
        }

        if (!err && data.Count !== 0 && typeof data.LastEvaluatedKey !== "undefined" ) {



            limitCounter += data.Count;



            // if there is more data we need to keep fetching

            if (typeof params.Limit !== "undefined" && limitCounter >= params.Limit) {
                callback(err, true);

            } else {


                params.ExclusiveStartKey = data.LastEvaluatedKey;

                query(params, function(err, done) {

                    if (done) {
                        callback(err, true);
                    }


                });
            }


        } else {

            callback(err, true);
        }

    });



}

function toCSV(dynoItems, callback) {

    console.log("Converting to CSV");
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
        s3Instance   = new AWS.S3(config);



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

    //TODO: Refactor this stuff out, create service, etc


    //lets configure storage
    if (configuration.hasOwnProperty('storage')) {

        // we're going to store with AWS S3
        if (configuration.storage.hasOwnProperty('s3')) {

            if (configuration.storage.s3.hasOwnProperty('instance')) {

                //we've been supplied with an s3 instance
                if (configuration.storage.s3.instance instanceof AWS.S3) {

                    s3Instance = configuration.storage.s3.instance;

                } else {
                    throw new Error('Instance is not of type AWS.S3');
                }
            }

            //bucket where this should be created
            if (configuration.storage.s3.hasOwnProperty('bucket')) {

                var params = {
                    Bucket: configuration.storage.s3.bucket
                };

                s3Instance.headBucket(params, function(err, data) {

                    if (!err && data.code !== 'NotFound') {
                        bucketName = configuration.storage.s3.bucket;
                    } else {

                        // if the bucket doesn't exist we need to create it
                        var params = {
                            Bucket: configuration.storage.s3.bucket,
                            ACL: 'authenticated-read'


                        };

                        s3Instance.createBucket(params, function(err, data) {

                            if (data) {
                                bucketName = configuration.storage.s3.bucket;
                                bucketLocation = data.Location;
                            } else {
                                throw new Error(err);
                            }

                        });


                    }

                });



            }

        }

    }
    //storing it in the local dir
    else {

    }


};

function writeToStorage(callback) {
    outputArray.unshift(attributesToGet.join());
    var fileName = new Date().toUTCString()+'.csv';
    var params = {

        Bucket: bucketName,
        Key: fileName,
        Body: outputArray.join('\r\n'),
        ContentType: 'text/csv',
        ContentDisposition: 'attachment;filename="'+fileName+'"'

    };

    s3Instance.putObject(params, function(err, data) {

        if (data) {


            var nParams = {Bucket: params.Bucket, Key: params.Key};
            s3Instance.getSignedUrl('getObject', nParams, function(err, url) {
                if (!err) {
                    callback(err, url);
                } else {
                    callback(err);
                }
            });
        } else {
            callback(err);
        }

    });

}

exports.exportData = function(params, callback) {


    output = [];
    outputArray = [];


    // if AttributesToGet is not defined or the user wants to get all the attributes
    if (typeof params.AttributesToGet === undefined || params.AttributesToGet.length < 1) {

    }




    attributesToGet = params.AttributesToGet.sort();

    query(params, function(err, done) {

        if (done) {

            toCSV(output, function(data) {

                outputArray = data;

                writeToStorage(function(err, url) {
                    callback(err, url);
                });


            });
        } else {
            callback(err);
        }


    });


};

exports.prettyPrint = function() {
    outputArray.unshift(attributesToGet.join());
    outputArray.forEach(function(row) {
       console.log(row);
    });

};
//
//exports.aliasAttributes = function(query) {
//
//};