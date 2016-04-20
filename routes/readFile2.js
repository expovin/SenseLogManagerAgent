var fs = require("fs");

module.exports = function(layer,level,callback) {
  
    // read file data synchronizely

    callback(null,{
    	    
    	read : function(){

	    var JSONData={};
	    var NomeFile={};
	    var Record={};
	    var Records=[];
	    var NomeCampi=[];

		fs.readdir("D:\\Log\\"+layer+"\\"+level+"\\", function(err, items) {
			 
			    for (var i=0; i<items.length; i++) {
			    	
			    	var FileToRead="D:\\Log\\"+layer+"\\"+level+"\\"+items[i];			        
			    	console.log("Leggo il file :"+FileToRead);

			    	var data = fs.readFileSync(FileToRead, "utf8"); 
			    	rows = data.split("\r\n");
			        

				    for(row in rows){
				    	if(row == 0){
				    		NomeCampi=rows[row].split("\t");
				    		//console.log(NomeCampi);
				    	}
				    	else{

				    		fields = rows[row].split("\t");
					    	for(field in fields){
					    		Record[NomeCampi[field]]=fields[field];
					    		//console.log(Record);
					        }
					        Records.push(Record);
				        }
				    }
				    NomeFile[items[i]]=Records;
				  

			}
			JSONData=NomeFile;
			console.log("Send data now!");				    
			return (JSONData);				
		});
	
        }

    });
};