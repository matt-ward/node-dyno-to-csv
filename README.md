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
dynoToCsv.configure({
                        dynamodbInstance: 'instanceof AWS.DynamoDB',
                        storage: {
                            s3: {
                                instance: 'instanceof AWS.S3',
                                bucket: 'name-of-bucket-to-save-to'
                                // If bucket doesn't exist, it will be created with ACL: authenticated-read 
                            }
                        }
                    });
```

```
/**
 * Converts dynamodb query result to csv format, callback with an s3 signedURL
 * @param {DynamoDB query} query 
 * @param {Callback} function(err, url)
 */
dynoToCsv.exportData(query, function(err, url) {

});
```