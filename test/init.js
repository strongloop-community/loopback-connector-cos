'use strict';

module.exports = require('should');

var DataSource = require('loopback-datasource-juggler').DataSource;



var config;

config = {
    connector: "loopback-connector-cos",
    name: "cloud-object-storage",
    endpoint: process.env.COS_ENDPOINT,
    apiKeyId: process.env.API_KEY_ID,
    serviceInstanceId: process.env.SERVICE_INSTANCE_ID,
    bucket: process.env.COS_BUCKET_NAME
  };
  
//console.log(config);
global.config = config;

global.getDataSource = global.getSchema = function(customConfig) {
  var db = new DataSource(require('../'), customConfig || config);
  return db;
  db.log = function(a) {
    console.log(a);
  };

  return db;
};
