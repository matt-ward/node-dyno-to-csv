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
npm install dyno-to-csv
```


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


### Just pass in a legitimate DynamoDB query and you're done.
### At the moment, your query must contain the property: AttributesToGet: [], I'm working on eliminating this requirement.
```
/**
 * Converts dynamodb query result to csv format, callback with an s3 signedURL
 * @param {DynamoDB query} query 
 * @param {Callback} function(err, url)
 */
dynoToCsv.exportData(query, function(err, url) {

});
```