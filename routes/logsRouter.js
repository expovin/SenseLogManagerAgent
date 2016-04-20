
    'use strict';
	var express = require('express');
	var bodyParser = require('body-parser');
	var reader = require('./readFile');


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
			console.log("Sono nella callback : "+data);

			
			res.json(data);			
		});

		reader.gerFileList(req.params.layer,req.params.level,function(err,fileList){
			console.log("Sono nella callback : "+fileList[0]);

			
			//res.json(data);			
		});		
	//	var promise = reader.LogReader(req.params.layer,req.params.level, function(error,result){

		/*
		readFile.contents(req.params.layer,req.params.level,function (err, resp) {
        if (err) throw err;
        console.log("Data received : "+resp);
        res.json(resp);
    }); 
    */

	//	console.log("Data received : "+data);
		
	});


	//exports.router = router;
    module.exports = router;
