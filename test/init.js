// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: loopback-connector-cos
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

'use strict';

module.exports = require('should');

var DataSource = require('loopback-datasource-juggler').DataSource;

var config;

config = {
  connector: 'loopback-connector-cos',
  name: 'cloud-object-storage',
  endpoint: process.env.COS_ENDPOINT,
  apiKeyId: process.env.COS_API_KEY_ID,
  serviceInstanceId: process.env.COS_SERVICE_INSTANCE_ID,
  bucket: process.env.COS_BUCKET_NAME,
};

global.config = config;

global.getDataSource = global.getSchema = function(customConfig) {
  var db = new DataSource(require('../'), customConfig || config);
  return db;
};
