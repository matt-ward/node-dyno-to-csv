var should = require('chai').should()
    ,  AWS = require('aws-sdk')
    ,  DynoToCSV = require('../index.js')
    ,  configure = DynoToCSV.configure
    ,  exportData = DynoToCSV.exportData
    ,  alias = DynoToCSV.aliasAttributes;


describe('#configure', function() {
    it('Configures the module with an instance of AWS Dynamodb and will throw an exception if it is not of type AWS.DynamoDB', function() {
        var instance = configure(new AWS.DynamoDB());

    })
});

describe('#AliasAttributes', function() {
    it('Aliases DynamoDB Attributes', function() {
        return true;
    });
})