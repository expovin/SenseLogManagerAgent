'use strict';

angular.module('QLog')

        .controller('HeaderController', ['$scope','$localStorage', function($scope,$localStorage) {

            $scope.addServer = function() {
                $localStorage.storeObject('ServerList', $scope.server.ServerName,$scope.ServersList);
            }
        }])        


        .controller('ServerController', ['$scope','logsViewFactory','storeServerList','$localStorage', function($scope,logsViewFactory,storeServerList,$localStorage) {
            
            $scope.layers = {};

            $scope.ServersList = $localStorage.getObject('ServerList');

            if($scope.ServersList.length !== 0)
            {
                for(var i=0; i< $scope.ServersList.length; i++ ){

                    $scope.layers =  logsViewFactory.getLog($scope.ServersList[i].name).query(
                    function(response) {
                        console.log($scope.layers);
                        $scope.ServersList[i-1].layers = $scope.layers;
                        $localStorage.updateServerLayers('ServerList',$scope.ServersList[i-1].name,$scope.ServersList[i-1].layers);
                        console.log(i+" - "+JSON.stringify($scope.ServersList[i-1]));
                    },
                    function(response) {
                        console.log("Qui ERRORE!");
                    });

                }            
            }

            $scope.removeServer = function (ServerName) {
                console.log("removeServer Triggered! "+ServerName);
            }

        }])  

;
