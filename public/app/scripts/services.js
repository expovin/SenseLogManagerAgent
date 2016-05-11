'use strict';

angular.module('QLog')
        .constant("baseURL","http://localhost:3000/")
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

                logsfac.getLog = function(){
                    JSON = $resource(baseURL+"logs/:layer/:level");
                    return JSON;
                };           
                return logsfac;
        }])

;
