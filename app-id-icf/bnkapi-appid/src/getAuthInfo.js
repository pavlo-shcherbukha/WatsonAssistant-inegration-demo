/**
  * 
  * main() will be run when you invoke this action
  * i_url -  заменить на  свой URL
  */

 const axios = require('axios');
 const i_url = 'https://[указать свой URL].mybluemix.net';
 const i_logid = 'appid: ';
 
 function main(a_params) {
	 var l_step='';
	 var result_err ;
	 var result_ok ;
	 var i_headers ;
	 var l_url ;
 
	 l_step = i_logid + ' - Старт';
	 console.log(l_step);
	 console.log(l_step + ' - проверяю входные параметры');   
	 try {
			 if ( !isDefined(a_params) ){
					 var err = new Error(i_logid + 'Не передан параметр a_params') ;
					 throw err;
			 } else if  ( !isDefined(a_params.sessionid) ) {
				 var err = new Error(i_logid + 'Не передан параметр a_params.sessionid') ;
				 throw err;
			 }
 

 
			 l_step = i_logid + ' - Формирую http заголовки';
			 console.log(l_step);
			 i_headers = { 	'Content-Type': 'application/json'
			 };
			 
			 l_url = i_url + '/oathctx/' + a_params.sessionid ;
			 l_step = i_logid + ' - Формирую конечный URL сервиса app-id ';
			 console.log(l_step);
	 } 
	 catch (err) {
		 result_err={ ok: false, error: err ,rdata: null};
		 return Promise.reject(  result_err );
	 }
	 l_step = i_logid + ' - Созадю обьект http заголовков';
	 console.log(l_step );    
	 let l_reqparams = {  headers: i_headers };
	 l_step = i_logid + 'Вызываю сервис url=: [' + l_url + ']';
	 console.log(l_step );    
	// l_step = i_logid + 'Вызываю сервис: data= [' + l_data + ']';
	// console.log(l_step );    
	 l_step = i_logid + 'Вызываю сервис: Headers= [' + JSON.stringify(l_reqparams) + ']';
	 console.log(l_step );    
 
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
		 result_ok={ ok: true,rdata: result.data};
		 return Promise.resolve(   result_ok );
		
	 })
	 .catch ( err => {
		 l_step = i_logid + 'Возвращаю ответ с ошибкой!' ;
		 console.log(l_step);
		 result_err={ ok: false, error: err ,rdata: null};
		 return Promise.reject(  result_err );
	 });
 }
 
	 /**
	  * Проверяет, что переменная на undefined и не null
	  * если OK возвразает true, если не сложилось - false
	  * @param {any} p_value любая переменная
	  * @returns {boolean} l_result результат проверки переменной 
	  */
 function isDefined(p_value) {
		 let l_result = true ;
		 if (typeof p_value === "undefined"){
			 l_result=false;
		 } else if ( p_value === null){
			 l_result=false;
		 } else {
			 // do nothing
		 };
		 return l_result ;     
 }
 
 exports.main = main;
 
  