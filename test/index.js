var should = require('chai').should()
    ,  AWS = require('aws-sdk')
    ,  DynoToCSV = require('../index.js')
    ,  configure = DynoToCSV.configure
    ,  exportData = DynoToCSV.exportData
    ,  describeTable = DynoToCSV.describe
    ,  alias = DynoToCSV.aliasAttributes;


describe('#configure', function() {
    it('Configures the module with an instance of AWS Dynamodb and will throw an exception if it is not of type AWS.DynamoDB', function() {
        configure({dynamodbInstance: new AWS.DynamoDB()});

    });

    it('Accepts AWS Credentials and instantiates a valid AWS session', function() {
    });
});

describe('#exportData', function() {
    this.timeout(60000);


    it('Exports data', function(done) {
    });



});

describe('#describeTable()', function() {
    it('Describes a dynamo table', function(done) {



    });
})



describe('#AliasAttributes', function() {
    it('Aliases DynamoDB Attributes', function() {
        return true;
    });
});