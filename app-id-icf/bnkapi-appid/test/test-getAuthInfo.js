/*
*
*/ 
 
 
const mocha = require('mocha');
const request = require('supertest');
const expect = require('chai').expect;
const assert = require('chai').assert;
const should = require('chai').should();

const IBMCloudEnv = require('ibm-cloud-env');
IBMCloudEnv.init('/params/mappings.json');


var vfunc = require('../src/getAuthInfo');

var test_env_lr = true ;

var i_token = '';
var i_userid = '';

let config={};
config.clientId= IBMCloudEnv.getString('clientId');         
config.tenantId= IBMCloudEnv.getString('tenantId');         
config.secret= IBMCloudEnv.getString('secret');           
config.umail= IBMCloudEnv.getString('usermail');             
config.upsw= IBMCloudEnv.getString('userpassword');   
                           



describe('APP-ID test oauth', function() {
  let test_server;
  let app;
  this.timeout(0);

 
  it('App-ID:' + 'Expect get Auth Info', function(done){
  
    var l_req={
         sessionid: '2-2-2-2-2-2'    
    };     


    if (test_env_lr) {
      console.log('Запрос: ');
      console.log( JSON.stringify(l_req) );
      console.log('Ответ: ');
    }  

    vfunc.main( l_req )
    .then (res => {
        res.should.have.property('ok');
        res.ok.should.equal(true);
        if (test_env_lr) {
                console.log( JSON.stringify(  res  )  );
        }   
        
       
        done();

    })
     .catch ( err => {
            console.log(err.message);
            done(err);
     
    });
  });  //it

  // end of test
 
});