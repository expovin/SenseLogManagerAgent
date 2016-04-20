var fs = require('fs');


var LogReader = {  

    init: function(){     

    },


    getRecords: function(layer,level,callback){
    	console.log("Parametri "+layer+" "+level);

	    var JSONData={};
	    var NomeFile={};
	    var Record={};
	    var Component={};
	    var Level={};
	    var Type={};
	    var Host={};
	    var Records=[];
	    var NomeCampi=[];

	    // File impostato per debug
	    fs.readdir("D:\\Log\\"+layer+"\\"+level+"\\", function(err, items) {
            for (var i=0; i<items.length; i++) {

			    nomeFile=items[i];

		        var data = fs.readFileSync("D:\\Log\\"+layer+"\\"+level+"\\"+nomeFile);

				rows = data.toString().split("\r\n");			        

				for(row in rows){
				   	if(row == 0){
				   		NomeCampi=rows[row].split("\t");
				    }
					else{
			    		fields = rows[row].split("\t");
				    	for(field in fields){
				    		Record[NomeCampi[field]]=fields[field];
					    }
						Records.push(Record);
					}
				}
				FileName = nomeFile.split(".");
				FileLevel = FileName[0].split("_");
				Component[FileLevel[1]] = Records;
				Level[level]=Component
				Type[FileLevel[2]]=Level;
				Host[FileLevel[0]]=Type;

				JSONData=Host;
		    }
		    callback(null, JSONData);
		});

    },
    gerFileList: function(layer,level,callback){

    	var fileList=[];
        //...
        fs.readdir("D:\\Log\\"+layer+"\\"+level+"\\", function(err, items) {

            callback(null, items);
        }); 
    },
    deleteTodo: function(todoId){
        //...
    }
};

module.exports = LogReader;  
