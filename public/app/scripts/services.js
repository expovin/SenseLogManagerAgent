'use strict';

angular.module('QLog')
        .constant("port","3000")
        .constant("baseURL","3000")



        .factory('addServerFactory',['$resource', 'baseURL', function($resource,baseURL) {          
    
            var headfac = {};

                headfac.getLayers = function(){
                    JSON = $resource(baseURL+"logs",null,  {'update':{method:'PUT' }});
                    return JSON;
                                                                    
                };           
                return headfac;
        }])

        

        .factory('logsViewFactory',['$resource', 'baseURL','$localStorage', function($resource,baseURL,$localStorage) {          
    
            var logsfac = {};
            var JSON = {};

                logsfac.getLog = function(serverName){
                    JSON = $resource("http://"+serverName+":"+baseURL+"/logs/:layer/:level");
                    return JSON;
                };  

                return logsfac;
        }])

        .factory('$sessionStorage',['$window', function($window) {

            var Mylogs = $window.sessionStorage['logs'];
            var stat = {};


            return {
                store: function (Server, Layer, Slog) {
                    var MyLog = $window.sessionStorage['logs_'+Server];

                    if(MyLog === undefined)
                        var MyLog = {};
                    else
                        MyLog = JSON.parse(MyLog);

                    MyLog[Layer] = Slog;

                    $window.sessionStorage['logs_'+Server] = JSON.stringify(MyLog);
                },
                get: function (Server) {
                    return JSON.parse($window.sessionStorage['logs_'+Server]);
                }       
            }

        }])


.factory('$localStorage', ['$window', function ($window) {

    var listServer = {};
    var ServerNode = {name:'', lastUpdateDate:''};

    return {
        store: function (key, value) {
            ServerNode.name = value;
            listServer.push(ServerNode);
            $window.localStorage[key] = listServer;
        },


        get: function (key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        },


        remove: function (key) {
            delete listServer[key];
            $window.localStorage["ServerList"] = JSON.stringify(listServer);
        },


        storeObject: function (key, value, array) {
            var listServer = $window.localStorage["ServerList"];

            if(listServer === undefined)
                listServer={};
            else
                listServer = JSON.parse(listServer);


            if(listServer[value] === undefined){
                var datetime = new Date();

                listServer[value] = {name:'', layers:{}, lastUpdateDate:''};
                listServer[value].name = value;
                listServer[value].lastUpdateDate = datetime;
                $window.localStorage[key] = JSON.stringify(listServer);
            }   
        },
        updateFileLayer : function (key,listServer) {
              console.log(listServer);
              $window.localStorage[key] = JSON.stringify(listServer);
        },

        updateServerLayers : function (key,serverName,Layers){
            var datetime = new Date();
            
            console.log("serverName "+serverName+" Layers "+Layers);
            listServer = JSON.parse($window.localStorage[key]);

            Layers.forEach(function(result,index){
                var LayerDetails = {numRecords: '', warnings:'', errors:'', lastUpdateDate:''};
                listServer[serverName].layers[result]=LayerDetails;   
            });
                    
            listServer[serverName].lastUpdateDate = datetime;
   
            $window.localStorage[key] = JSON.stringify(listServer);
        },
        updateLayersStats : function(serverName,Layer,Slog) {
         // Accedo al local Storage per fare un update delle informazioni di sintesi sui log raccolti
         // e le scrivo nel JSON per ogni Layer
            var listServer = JSON.parse($window.localStorage["ServerList"]);
            var File={};
            var Dir={};
            var Field={};
            var cont=0;

            listServer[serverName].layers[Layer].numRecords=Object.keys(Slog).length;
            angular.forEach(Slog, function(valueDir, keyDir){
                Dir={};
                File={};
                angular.forEach(valueDir, function(valueFile, keyFile){
                    //console.log("value : "+keyFile+" "+JSON.stringify(valueFile.Header));
                    cont = 0;
                    angular.forEach(valueFile.Header , function(result, index){
                        if(cont < 6)
                            Field[result]='YES';
                        else
                            Field[result]='NO';
                        cont++;
                        File[keyFile]=Field;
                    });
                    
                    Dir[keyDir]=File;
                    Field={};
                    listServer[serverName].layers[Layer][keyDir]=Dir[keyDir];
                });
            });


            $window.localStorage["ServerList"] = JSON.stringify(listServer);
        },
        getObject: function (key, defaultValue) {
            return JSON.parse($window.localStorage[key] || '{}');
        }
    }
}])


        .factory('storeServerList', ['$rootScope', function ($rootScope) {

            var service = {

                Servers: [],

                SaveState: function (serverName) {
                    // Controllo che il valore non sia gia presente
                    for(var i=0; i<service.Servers.length; i++){
                        if(service.Servers[i]==serverName)
                            return;
                    }
                    service.Servers.push(serverName);
                    sessionStorage.userService = angular.toJson(service.Servers);
                },

                RestoreState: function () {
                    service.Servers = angular.fromJson(sessionStorage.userService);
                    console.log(service.Servers);
                }
            }

            $rootScope.$on("savestate", service.SaveState);
            $rootScope.$on("restorestate", service.RestoreState);

            return service;
        }])        

;
