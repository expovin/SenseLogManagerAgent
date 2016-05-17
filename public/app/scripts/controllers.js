'use strict';

angular.module('QLog')

        .controller('HeaderController', ['$scope','$window','$localStorage', function($scope,$window,$localStorage,$sessionStorage) {

            $scope.addServer = function() {
                $localStorage.storeObject('ServerList', $scope.server.ServerName,$scope.ServersList);
                $window.location.reload();
            }
        }])        

        .controller('LogsViewController', ['$scope','$sessionStorage', function($scope,$sessionStorage) {

            $scope.logs = $sessionStorage.get('localhost');

        }])           


        .controller('ServerController', ['$scope','$window','logsViewFactory','storeServerList','$localStorage', '$sessionStorage', 
            function($scope,$window,logsViewFactory,storeServerList,$localStorage,$sessionStorage) {
            
            $scope.layers = {};
            $scope.stat = {};

            $scope.ServersList = $localStorage.getObject('ServerList');

            if($scope.ServersList.length !== 0)
            {
                  for(var k in $scope.ServersList){
                    
                    $scope.layers =  logsViewFactory.getLog($scope.ServersList[k].name).query(
                    function(response) {                        
                        $scope.ServersList[k].layers = $scope.layers;
                        $localStorage.updateServerLayers('ServerList',$scope.ServersList[k].name,$scope.ServersList[k].layers);
                        $scope.ServersList = $localStorage.getObject('ServerList');
                    },
                    function(response) {
                        console.log("Qui ERRORE!");
                    });
                }            
            }

            $scope.removeServer = function (ServerName) {
                $localStorage.remove(ServerName);
                $window.location.reload();
            }

            $scope.getLayersLog = function (ServerName) {

                $scope.ServersList.forEach(function(result,index){
                    if(result.name === ServerName) {
                        result.layers.forEach(function(layer,idx){
                            console.log("Getting "+layer);
                            $scope.logs = logsViewFactory.getLog(ServerName).get({layer:layer})
                            .$promise.then(
                                            function(response){
                                                console.log("Log acquired!");
                                                $sessionStorage.store(ServerName,layer,$scope.logs);
                                                
                                            },
                                            function(response) {
                                                console.log("Errore!");
                                            }
                            );

                        }); 
                    }

                });

            }      

            $scope.getLayerLog = function (ServerName,layer) {

                console.log("Getting "+layer);
                $scope.logs = logsViewFactory.getLog($scope.ServersList[ServerName].name).get({layer:layer})
                .$promise.then(
                    function(response){
                        $sessionStorage.store(ServerName,layer,response);
                    },
                    function(response) {
                        console.log("Errore!");
                    }
                );

                //Reload Controllers
                //$route.reload();
            } 
        }])  

;
