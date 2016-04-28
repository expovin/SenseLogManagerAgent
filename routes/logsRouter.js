
    'use strict';
	var express = require('express');
	var bodyParser = require('body-parser');
	var reader = require('./readFileCash');


	var router = express.Router();

	router.use(bodyParser.json());

	// get all the Folder name in the logs dir
	router.route('/')
	.get(function(req,res,next){
    	reader.gerComponents(function(err,data){
    		res.json(data);
    	})
	});

	// get the content log file
	router.route('/:layer')    
	.get(function(req,res,next){    
		reader.getLayer(req.params.layer,function(err,data){		
			res.json(data);			
		});			
	});


	// get the content log file
	router.route('/:layer/:level')    
	.get(function(req,res,next){    
		reader.getRecords(req.params.layer,req.params.level,function(err,data){			
			res.json(data[req.params.layer][req.params.level]);			
		});			
	});


	//exports.router = router;
    module.exports = router;
