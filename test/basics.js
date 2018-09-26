// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: loopback-connector-cos
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

'use strict';

require('./init.js');
var should = require('should');
var ds, COSModel;


describe('cos model creation', function() {
  before(function(done){
    ds = global.getDataSource(); //.settings is your config

    COSModel = ds.define('COSModel', {
      name: {type: String},
      age: {type: Number},
    });
    ds.automigrate(done);
  });

  describe('model data gets updated properly', function() {
    var cos1, cos2;
    before('create entry', function(done) {
      this.timeout(0);

      COSModel.create({
        name: 'Conor',
        age: 23,
        shopping: ['apple','orange'],
      })
      .then(cosmod => {
        cos1 = cosmod;
        console.log("COS!, ",cos1);

        return COSModel.create({
          name: 'John',
          age: 51,
          shopping: ['chocolate','crisps']
        })
      })
      .then(cosmod2 => {
        cos2=cosmod2;
        console.log("COS2 ",cos2);
        done();
      });
    });

    it('updates a name from Conor to Paul, tests if findByID',
      function(done) {
        cos1.setAttribute('name', 'Paul');
        COSModel.updateOrCreate(cos1, function(err) {
          if (err) return done(err);
          COSModel.findById(cos1.id, function(err, res) {
            if (err) done(err);

            res.name.should.equal(cos1.name);
            res.shopping.should.deepEqual(cos1.shopping);
            COSModel.findById(cos2.id, function(err, res) {
              if (err) done(err);
              res.name.should.equal(cos2.name);
              res.shopping.should.deepEqual(cos2.shopping);
              done();
            });
          });
        });
      });

    describe('checking if entries can be deleted',function(){

      it('destroy instances with "where" filter', function(done) {
        var before;
        COSModel.find(function(err, result) {
          before=result;
          should.equal(result.length, 2);
        });

        COSModel.destroyAll({id: cos1.id},function(err, result) {
          should.not.exist(err);
          should.exist(result);

          COSModel.find(function(err, result) {
            should.not.exist(err);
            should.exist(result);
            should.equal(result.length, 1);
            before[1].id.should.equal(result[0].__data.id);
            should.not.exist(result[1]);
            done();
          });
        });
      });
      after(function(done){
        done();
      });
    });
  });
});