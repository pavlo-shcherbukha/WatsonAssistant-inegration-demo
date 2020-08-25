/*
 Copyright 2019 IBM Corp.
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

const express = require("express");
const session = require("express-session");
const passport = require("passport");
const appID = require("ibmcloud-appid");
const query = require('querystring');
const axios = require('axios');
//const redis     = require('redis');


const IBMCloudEnv = require('ibm-cloud-env');

IBMCloudEnv.init('/mappings.json');


const WebAppStrategy = appID.WebAppStrategy;

const app = express();

var CALLBACK_URL = "/ibm/cloud/appid/callback";
//const CALLBACK_URL = 'http://localhost:8080/protected/xtest';

const port = process.env.PORT || 8080;

/*
rcln = redis.createClient({
    port      : 16379,      
    host      : 'localhost', 
    password  : 'qq'
});

rcln.on('connect', function() {
    console.log('REDIS connected');
});
*/

// Setup express application to use express-session middleware
// Must be configured with proper session storage for production
// environments. See https://github.com/expressjs/session for
// additional documentation
app.use(session({
	secret: "123456",
	resave: true,
	saveUninitialized: true,
	proxy: true
}));

// Configure express application to use passportjs
app.use(passport.initialize());
app.use(passport.session());

//let webAppStrategy = new WebAppStrategy(getAppIDConfig());
//passport.use(webAppStrategy);

// Configure passportjs with user serialization/deserialization. This is required
// for authenticated session persistence accross HTTP requests. See passportjs docs
// for additional information http://passportjs.org/docs
passport.serializeUser((user, cb) => cb(null, user));
passport.deserializeUser((obj, cb) => cb(null, obj));

// Callback to finish the authorization process. Will retrieve access and identity tokens/
// from AppID service and redirect to either (in below order)
// 1. the original URL of the request that triggered authentication, as persisted in HTTP session under WebAppStrategy.ORIGINAL_URL key.
// 2. successRedirect as specified in passport.authenticate(name, {successRedirect: "...."}) invocation
// 3. application root ("/")
app.get(CALLBACK_URL, 
             passport.authenticate(WebAppStrategy.STRATEGY_NAME, 
			 {failureRedirect: '/error'}));

// Protect everything under /protected
app.use("/protected", passport.authenticate(WebAppStrategy.STRATEGY_NAME));

// This will statically serve pages:
app.use(express.static("public"));


// // This will statically serve the protected page (after authentication, since /protected is a protected area):
app.use('/protected', express.static("protected"));

app.get("/logout", (req, res) => {
	WebAppStrategy.logout(req);
	res.redirect("/");
});

//Serves the identity token payload
app.get("/protected/api/idPayload", (req, res) => {

	const userProfileManager = appID.UserProfileManager;
   /*
	* @param {Object} options The options object initializes the object with specific settings, If you are uploading the application to IBM cloud, those credentials can be read from IBM cloud and you can initialize this object without any options
	* @param {string} options.appidServiceEndpoint appid's service endpoint
	* @param {string} options.version appid's server version in a format if v3/v4
	* @param {string} options.tenantId your application tenantId
	* @param {string} options.oauthServerUrl appid's server url- needs to be provided if service endpoint isn't provided
	* @param {string} options.profilesUrl appid's user profile url - needs to be provided if service endpoint isn't provided
    */



	userProfileManager.init(  getAppIDConfig()  );
	var accessToken = req.session[WebAppStrategy.AUTH_CONTEXT].accessToken; 
	var identityToken = req.session[WebAppStrategy.AUTH_CONTEXT].identityToken; 
	console.log('accessToken=' + accessToken);
	userProfileManager.getUserInfo(accessToken, identityToken)
	.then(function (userInfo) {
		console.log( 'userInfo = ' + JSON.stringify(userInfo) );   
		return userProfileManager.getAllAttributes(accessToken) ;
	})
	.then (  attributes => {
		console.log( 'attributes = ' + JSON.stringify( attributes) );   
                var rsp11 = req.session[WebAppStrategy.AUTH_CONTEXT].identityTokenPayload;
                    rsp11.accessToken = req.session[WebAppStrategy.AUTH_CONTEXT].accessToken;
		//return Promise.resolve( res.send(req.session[WebAppStrategy.AUTH_CONTEXT].identityTokenPayload) ) ;
               return Promise.resolve( res.send( rsp11  )) ;
	})
	.catch( err =>{
		return Promise.reject(err);
	})
});

app.get('/error', (req, res) => {
	res.send('Authentication Error');
});

app.get('/protected/api/wsession/:id', function(req, res){
	var i_logid = 'xz';
	var l_step = '?';
	var lsession = req.params.id ;
	
	var accessToken = req.session[WebAppStrategy.AUTH_CONTEXT].accessToken; 
	var identityToken = req.session[WebAppStrategy.AUTH_CONTEXT].identityToken; 
	console.log('accessToken=' + accessToken);
	const userProfileManager = appID.UserProfileManager;
	userProfileManager.init(  getAppIDConfig()  );


	var lresp = { ok: true, wasessionid: lsession} ;
	var ltoken = {}; 
	let i_headers = { 	'Content-Type': 'application/json'};
	let l_reqparams = {  headers: i_headers };
	//http://caplonsgprd-1.securegateway.appdomain.cloud:15834/bnkapi/authctx
	var l_url = 'http://caplonsgprd-1.securegateway.appdomain.cloud:15834/bnkapi/authctx';
	return userProfileManager.getUserInfo(accessToken, identityToken)
	.then ( userInfo => {
		console.log( 'userInfo = ' + JSON.stringify(userInfo) );  
		ltoken = { 
			atoken: accessToken,
			itoken: identityToken ,
			wsession: lsession,
			name: userInfo.name,
			email: userInfo.email,
			given_name: userInfo.given_name,
			family_name: userInfo.family_name
	   }; 
       
	   return axios.post(l_url, ltoken,l_reqparams);	
	})
	.then ( result => {
		if (result.status === 200) {
			l_step = i_logid + 'Сервис вернул успешный статус: [' + result.status.toString() + ']';
			console.log(l_step);
		} else {
			l_step = i_logid + 'Сервис вернул статус - ошибку: [' + result.status.toString() + ']';
			console.log(l_step);
			throw new Error(l_step);

		} 
		 l_step = i_logid + 'Возвращаю ответ' ;
		console.log(l_step);
		//result_ok={ ok: true,rdata: result.data};
		//return Promise.resolve(  res.status(200).json( result.data ) );
		return  Promise.resolve( res.status(200).sendFile( process.cwd()+'/public/'+'finish.html'));
	})	
	.catch ( err => {
			l_step = i_logid + 'Возвращаю ответ с ошибкой!' ;
			console.log(l_step);
			//result_err={ ok: false, error: err ,rdata: null};
			return Promise.reject(  res.status(500).json( {error: err.message}) );
	});






	/*
	rcln.hmset( lsession, ltoken, (err, result)=>{
		if (err) {
			
			console.log('Ощибка записи в reddis');
			return res.status(500).json( ltoken );
		} else {

			console.log('УРРРРАААА в reddis записали!!!!');
			return res.status(200).json( ltoken );
		}
	*/	



	//});


});

app.get('/ouctx/:id', function(req, res){
	var lsession = req.params.id ;
	var xtoken = 'atoken';
	rcln.hmget(lsession, 'atoken','itoken','wsession','name', 'email', 'given_name','family_name',(err, result)=>{ 
          if (err) {
			console.log('Ощибка чтения из reddis');
			return res.status(500).json( {error: err.message} );
		  } else {
			console.log('УРРРРАААА из reddis прочитали!!!!');
			var l_resp = {
				atoken: result[0],
				itoken: result[1],
				wsessi: result[2],
				name: result[3],
				email: result[4],
				given_name: result[5],
				family_name: result[6],
			};
			//return res.status(200).json( l_resp );
			return res.status(200).sendFile( process.cwd()+'/public/'+'finish.html');
		  }

	});
	//return res.status(200).json( ltoken );

});

app.get( '/oathctx/:id', function(req, res)    {
	var i_logid = 'xz';
	var l_step = '?';
	var lsession = req.params.id ;
	let i_headers = { 	'Content-Type': 'application/json'};
	let l_reqparams = {  headers: i_headers };
	//http://caplonsgprd-1.securegateway.appdomain.cloud:15834/bnkapi/authctx
	var l_url = 'http://caplonsgprd-1.securegateway.appdomain.cloud:15834/bnkapi/authctx'+'/'+lsession;
	return  axios.get(l_url, l_reqparams)
	.then ( result => {
		if (result.status === 200) {
			l_step = i_logid + 'Сервис вернул успешный статус: [' + result.status.toString() + ']';
			console.log(l_step);
		} else {
			l_step = i_logid + 'Сервис вернул статус - ошибку: [' + result.status.toString() + ']';
			console.log(l_step);
			throw new Error(l_step);

		} 
		 l_step = i_logid + 'Возвращаю ответ' ;
		console.log(l_step);
		//result_ok={ ok: true,rdata: result.data};
		return Promise.resolve(  res.status(200).json( result.data ) );
	})	
	.catch ( err => {
			l_step = i_logid + 'Возвращаю ответ с ошибкой!' ;
			console.log(l_step);
			//result_err={ ok: false, error: err ,rdata: null};
			return Promise.reject( res.status(500).json(  {error: err.message}) );
	});
})



app.get('/xtest', function(req, res){
    console.log('получаю WEB HOOK');
	console.log(JSON.stringify(req.headers) );

	var r_wasession = req.query.sessionid;
	console.log( 'got wsession ' +  r_wasession);

	var user = { watsonsession: r_wasession };
	var luri=CALLBACK_URL+'/' + r_wasession;
	console.log( 'luri=' + luri );

	let appcfg= getAppIDConfig();
	let webAppStrategy = new WebAppStrategy(  appcfg  );
    passport.use(webAppStrategy);

	var l_url='/protected/api/wsession/'+r_wasession ;
	//var l_url='http://localhost:8080/protected/api/wsession/'+r_wasession ;
	//var l_url='http://localhost:8080/protected/api/wsession/' ;
	res.setHeader('wsession', r_wasession);
	res.setHeader('Location', r_wasession);
	res.redirect(l_url);
	res.status=302;
});



app.listen(port, () => {
	console.log("Listening on http://localhost:" + port);
});

function getAppIDConfig() {
	let config={};
	
	try {
		// if running locally we'll have the local config file
		//config = require('./localdev-config.json');
		config.clientId= IBMCloudEnv.getString('clientId');         
		config.tenantId= IBMCloudEnv.getString('tenantId');         
		config.secret= IBMCloudEnv.getString('secret');           
		config.name= IBMCloudEnv.getString('name');             
		config.oAuthServerUrl= IBMCloudEnv.getString('oAuthServerUrl');   
		config.profilesUrl= IBMCloudEnv.getString('profilesUrl');      
		config.discoveryEndpoint= IBMCloudEnv.getString('discoveryEndpoint');
		config.type=IBMCloudEnv.getString('type');           
		config.scopes= [];             
		config.redirectUri= IBMCloudEnv.getString('redirectUri');        
														   



	} catch (e) {
		if (process.env.APPID_SERVICE_BINDING) { // if running on Kubernetes this env variable would be defined
			config = JSON.parse(process.env.APPID_SERVICE_BINDING);
			config.redirectUri = process.env.redirectUri;
		} else { // running on CF
			//let vcapApplication = JSON.parse(process.env["VCAP_APPLICATION"]);
			//return {"redirectUri" : "https://" + vcapApplication["application_uris"][0] + CALLBACK_URL};
			
			config.clientId= IBMCloudEnv.getString('clientId');         
			config.tenantId= IBMCloudEnv.getString('tenantId');         
			config.secret= IBMCloudEnv.getString('secret');           
			config.name= IBMCloudEnv.getString('name');             
			config.oAuthServerUrl= IBMCloudEnv.getString('oAuthServerUrl');   
			config.profilesUrl= IBMCloudEnv.getString('profilesUrl');      
			config.discoveryEndpoint= IBMCloudEnv.getString('discoveryEndpoint');
			config.type=IBMCloudEnv.getString('type');           
			config.scopes= [];             
			config.redirectUri= IBMCloudEnv.getString('redirectUri');        
                                                               
			
		}
	}
	return config;
}