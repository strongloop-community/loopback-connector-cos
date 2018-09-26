// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: loopback-connector-cos
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

'use strict';

exports.initialize = function initializeDataSource(dataSource, callback) {

	dataSource.connector = new COSConnector(dataSource.settings);
	process.nextTick(function () {
		callback && callback();
	});
};
const Connector = require('loopback-connector').Connector;
const debug = require('debug')('loopback:connector:cos');
const uuidv4 = require('uuid/v4');

require('util').inherits(COSConnector, Connector);

const IBM = require('ibm-cos-sdk');

exports.COSConnector = COSConnector;

function COSConnector(dataSourceProps) {

	this.endpoint = dataSourceProps.endpoint;
	this.apiKeyId = dataSourceProps.apiKeyId;
	this.ibmAuthEndpoint = 'https://iam.ng.bluemix.net/oidc/token';
	this.serviceInstanceId = dataSourceProps.serviceInstanceId;
	this.bucket = dataSourceProps.bucket;
	this.response = [];
	this._models = {};

	this.config = {
		endpoint: this.endpoint,
		apiKeyId: this.apiKeyId,
		ibmAuthEndpoint: this.ibmAuthEndpoint,
		serviceInstanceId: this.serviceInstanceId,
	};
	this.cos = new IBM.S3(this.config);

}


//creates entry in bucket
COSConnector.prototype.create = function create(model, data, callback){
	var key = uuidv4();
	var dataStr = JSON.stringify(data); 

	return this.cos.putObject({
		'Bucket': this.bucket, 
		'Key': key, 
		'Body': dataStr,
	}).promise()
		.then(() => {
    
			data.id=key;
			this.response.push(data);
			callback(null, data.id);
		})
		.catch(err => {
			debug('Cannot delete %j: %s', where, err.stack || err);
			callback(err);
		});
};

//deletes entry to bucket based on object name
exports.COSConnector.prototype.destroyAll = function destroy(model,where,callback){

	if(where.id){
		var dataStr = where.id;

		return this.cos.deleteObject({
			Bucket: this.bucket,
			Key: dataStr
		}).promise()
			.then(() =>{
				var i =0;
				for (i = 0; i < this.response.length; i++) {
					if (this.response[i].id === where.id) {
						this.response.splice(i,1);
						callback(null, []);
						return;
					}
				}
			})
			.catch(err => {
				debug('Cannot delete %j: %s', where, err.stack || err);
				callback(err);
			});
		}else{
			return ('ERROR: The name of the object you wish to delete was not specified');
		}
	
};


exports.COSConnector.prototype.updateAttributes = function updateAttrs(model, id, data, callback) {
	var dataStr = JSON.stringify(data);
	return this.cos.putObject({
		'Bucket': this.bucket, 
		'Key': id, 
		'Body': dataStr 
	}).promise()
		.then(() => {

			/*
 * console.log(`Item: created!`); 
 * console.log("DATA SENT ",data);
 */
			var i =0;
			for (i = 0; i < this.response.length; i++) {
				if (this.response[i].id === id) {
					data.id=id;
					this.response[i] = data;
					callback(null, data);
					return;
				}
			}
		})
		.catch(err => {
			debug('Cannot delete %j: %s', where, err.stack || err);
			callback(err);
		});
};



//lists all details/entries of the bucket
exports.COSConnector.prototype.all = function (model, filter, callback) {
	if (filter && filter.where && filter.where.id) { //GET with id operation
		this.response.forEach(function (field) {
			if (filter.where.id === field.id) {
				callback(null, [field]);
				return;
			}
		});
	} else { //GET all operation
		callback(null, this.response);
	}
};