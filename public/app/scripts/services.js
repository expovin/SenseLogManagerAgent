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
            console.log("In storeObject");
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
              $window.localStorage[key] = JSON.stringify(listServer);
        },

        updateServerLayers : function (key,serverName,Layers){
            
            var datetime = new Date();
            
            listServer = JSON.parse($window.localStorage[key]);
            if(listServer[serverName].layers != undefined){
                    if(listServer[serverName].layers[Layers] == undefined){
                    Layers.forEach(function(result,index){
                        var LayerDetails = {numRecords: '', warnings:'', errors:'', lastUpdateDate:''};
                        listServer[serverName].layers[result]=LayerDetails;   
                    });
                }
            }

                    
            listServer[serverName].lastUpdateDate = datetime;
   
            $window.localStorage[key] = JSON.stringify(listServer);
        },
        updateLayersStats : function(serverName,Layer,Slog) {
         // Accedo al local Storage per fare un update delle informazioni di sintesi sui log raccolti
         // e le scrivo nel JSON per ogni Layer
         console.log("In updateLayersStats");
            var listServer = JSON.parse($window.localStorage["ServerList"]);
            var File={};
            var Dir={};
            var FieldList={};
            var Field={};
            var cont=0;

            angular.forEach(Slog, function(valueDir, keyDir){
                Dir={};
                File={};

                if (listServer[serverName].layers[Layer][keyDir] == undefined){
                    angular.forEach(valueDir, function(valueFile, keyFile){
                        cont = 0;
                        angular.forEach(valueFile.Header , function(result, index){
                            if(cont < 6){
                                Field['name']=result;
                                Field['show']='YES';
                            }
                            else{
                                Field['name']=result;
                                Field['show']='NO';
                            }
                            FieldList[result]=Field
                            Field={};
                            cont++;
                        });
                        cont=0;
                        File[keyFile]=FieldList;
                        FieldList={};
                        
                        Dir[keyDir]=File;
                        Field={};
                        listServer[serverName].layers[Layer][keyDir]=File;
                    });
                }

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
