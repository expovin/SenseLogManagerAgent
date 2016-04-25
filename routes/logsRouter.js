
    'use strict';
	var express = require('express');
	var bodyParser = require('body-parser');
	var reader = require('./readFileCash');


	var router = express.Router();

	router.use(bodyParser.json());

	// get all the Folder name in the logs dir
	router.route('/')
	.get(function(req,res,next){
		    res.writeHead(200, { 'Content-Type': 'text/plain' });
	        res.end('Will send all the logs to you!');
	})



	// get the content log file
	router.route('/:layer/:level')    
	// This function get the content of Engine, Proxy, Repository and Scheduler foledr
/*
	.all(function(req,res,next) {
	      res.writeHead(200, { 'Content-Type': 'text/plain' });
	      next();
	})
*/

	.get(function(req,res,next){    
		console.log("Prima della call");
		reader.getRecords(req.params.layer,req.params.level,function(err,data){			
			res.json(data);			
		});
	
		
	});


	//exports.router = router;
    module.exports = router;
