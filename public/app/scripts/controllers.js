'use strict';

angular.module('QLog')

        .controller('AboutController', ['$scope','logsViewFactory', function($scope,logsViewFactory) {
            
            $scope.layers = {};
            $scope.server = {ServerName :""};
            
            $scope.addServer = function() {
                console.log("addServer called! "+$scope.server.ServerName);

                $scope.layers =  logsViewFactory.getLog().query(
                function(response) {
                    console.log("Tutto ok!");
                    console.log($scope.layers);
                },
                function(response) {
                    console.log("Qui ERRORE!");
                });
                
            }
        }])        

;
