'use strict';

angular.module('QLog')
        .constant("port","3000")
        .constant("baseURL","3000")
//        .factory('menuFactory', ['$http', 'baseURL', function($http,baseURL) {
        .service('menuFactory', ['$resource', 'baseURL', function($resource,baseURL) {          
          var menufac = {};

                this.getDishes = function(){
                    return $resource(baseURL+"dishes/:id",null,  {'update':{method:'PUT' }});
                };

    
                // implement a function named getPromotion
                // that returns a selected promotion.

                this.getPromotion = function(index){ 
                    return $resource(baseURL+"promotions/:id",null,  {'update':{method:'PUT' }});
                };                      

          //      return menufac;                    
        }])

        .factory('corporateFactory',['$resource', 'baseURL', function($resource,baseURL) {          
    
            var corpfac = {};
     
            // Implement two functions, one named getLeaders,
            // the other named getLeader(index)
            // Remember this is a factory not a service

                corpfac.getLeaders = function(){
                    return $resource(baseURL+"leadership/:id",null,  {'update':{method:'PUT' }});
                };           
                return corpfac;
        }])


        .factory('addServerFactory',['$resource', 'baseURL', function($resource,baseURL) {          
    
            var headfac = {};

                headfac.getLayers = function(){
                    JSON = $resource(baseURL+"logs",null,  {'update':{method:'PUT' }});
                    return JSON;
                                                                    
                };           
                return headfac;
        }])

        

        .factory('logsViewFactory',['$resource', 'baseURL', function($resource,baseURL) {          
    
            var logsfac = {};
            var JSON = {};

                logsfac.getLog = function(serverName){
                    JSON = $resource("http://"+serverName+":"+baseURL+"/logs/:layer/:level");
                    return JSON;
                };           
                return logsfac;
        }])


.factory('$localStorage', ['$window', function ($window) {

    var listServer = [];
    var ServerNode = {name:'', lastUpdateDate:''};

    return {
        store: function (key, value) {
            ServerNode.name = value;
            listServer.push(ServerNode);
            console.log(listServer);
            $window.localStorage[key] = listServer;
        },
        get: function (key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        },
        remove: function (key) {
            $window.localStorage.removeItem(key);
        },
        storeObject: function (key, value, array) {
            var listServer = array;
            var ServerNode = {name:'', layers:'', lastUpdateDate:''};

            for(var i=0; i<listServer.length; i++){
                if(listServer[i].name===value)
                    return;
            }
            var datetime = new Date();
            console.log("Gong to add Key:"+key+" Value:"+value+" Last update "+datetime);
            
            ServerNode.name = value;
            ServerNode.lastUpdateDate = datetime;
            listServer.push(ServerNode);

            $window.localStorage[key] = JSON.stringify(listServer);
        },
        updateServerLayers : function (key,serverName,Layers){
            var datetime = new Date();
            listServer = JSON.parse($window.localStorage[key]);

            for(var i=0; i<listServer.length; i++){
                if(listServer[i].name===serverName){
                    listServer[i].layers = Layers;
                    listServer[i].lastUpdateDate = datetime;
                }

            }     
            $window.localStorage[key] = JSON.stringify(listServer);       

        },
        getObject: function (key, defaultValue) {
            return JSON.parse($window.localStorage[key] || '[]');
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
