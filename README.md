node-dyno-to-csv
================

A NodeJS Module that exports AWS DynamoDB query results to CSV, presently only stores to S3.
Module will return an S3 signedURL pointing to the saved data.

#### //TODO: 
* Save locally
* Configure AWS to be more flexible
* Alias Column Headers
* Reduce query complexity

Usage
------




```
var dynoToCsv = require('dyno-to-csv'); 
```
##### Configure with AWS Credentials
```
dynoToCsv.configure({
                        credentials: {
                            accessKeyId: 'accessID',
                            secretAccessKey: 'secret',
                            region: 'us-east-1'
                        },
                        storage: {
                            s3: {
                                bucket: 'name-of-bucket-to-save-to' 
                                // If bucket doesn't exist, it will be created with ACL: authenticated-read 
                            }
                        }
                    });
```
                    
#### Or Configure with existing AWS Instance from your application

```
/**
 * This assumes you've already configured AWS somewhere in your app.
 * Now you're just going to use, instances of AWS services.
 */

var dynamoDb = new AWS.DynamoDB();
var s3       = new AWS.S3();

dynoToCsv.configure({
                        dynamodbInstance: dynamoDb,
                        storage: {
                            s3: {
                                instance: s3,
                                bucket: 'name-of-bucket-to-save-to'
                                // If bucket doesn't exist, it will be created with ACL: authenticated-read 
                            }
                        }
                    });
```

### Just pass in a legitimate DynamoDB query and you're done.
```
/**
 * Converts dynamodb query result to csv format, callback with an s3 signedURL
 * @param {DynamoDB query} query 
 * @param {Callback} function(err, url)
 */
dynoToCsv.exportData(query, function(err, url) {

});
```