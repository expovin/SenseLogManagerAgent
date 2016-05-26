'use strict';

angular.module('QLog')
        .controller('HeaderController', ['$scope','$rootScope','$window','$localStorage','$state', function($scope,$rootScope,$window,$localStorage,$state) {

            $scope.listServer = $localStorage.getObject('ServerList',{});

            $scope.setActiveServer = function(serverName) {
                console.log(serverName);
                $rootScope.server=serverName;
                $state.go('app.LogsView', {
                    url: 'LogsView',
                    views: {
                        'content@': {
                            templateUrl : 'views/LogsView.html',
                            controller  : 'LogsViewController'
                        }
                    }
                });

            }

            $scope.addServer = function() {
                $localStorage.storeObject('ServerList', $scope.server.ServerName,$scope.ServersList);
                $window.location.reload();
            }
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
                // Da qui richiamo in ciclo ricorsivo la getLayerLog

                var layer = $localStorage.getObject("ServerList",{});
                console.log(layer[ServerName].layers);
                 this.getLayerLog(ServerName,'Engine');
            }      

            $scope.getLayerLog = function (ServerName,layer) {
                $scope.logs = logsViewFactory.getLog($scope.ServersList[ServerName].name).get({layer:layer})
                .$promise.then(
                    function(response){
                        $sessionStorage.store(ServerName,layer,response);
                        $localStorage.updateLayersStats(ServerName,layer,response);
                    },
                    function(response) {
                        console.log("Errore!");
                    }
                );
            } 
        }])  

        .controller('LogsViewController', ['$scope','$rootScope','$window','$localStorage','$sessionStorage','$modal','$location', function($scope,$rootScope,$window,$localStorage,$sessionStorage,$modal,$location) {
            

            $scope.server = $location.search().server;

            $scope.logs = $sessionStorage.get($scope.server);
            console.log("Carico LogsViewController "+$scope.server);

            $scope.activeLayer = Object.keys($scope.logs)[0];
            $scope.activeDir = Object.keys($scope.logs[$scope.activeLayer])[0];
            $scope.activeFile = Object.keys($scope.logs[$scope.activeLayer][$scope.activeDir])[0];


            $scope.selectLayer = function (layerName) {
                $scope.activeLayer = layerName;
                $scope.activeDir = Object.keys($scope.logs[$scope.activeLayer])[0];
                $scope.activeFile = Object.keys($scope.logs[$scope.activeLayer][$scope.activeDir])[0];                
            }

            $scope.selectDir = function (dirName) {
                $scope.activeDir = dirName;
                $scope.activeFile = Object.keys($scope.logs[$scope.activeLayer][$scope.activeDir])[0];
            }      

            $scope.selectFile = function (fileName) {
                $scope.activeFile = fileName;
            }      

            $scope.showColl = function(Layer,Dir,File,callName){
                    $scope.listServer = JSON.parse($window.localStorage["ServerList"]);
                    return ($scope.listServer[$scope.server]["layers"][Layer][Dir][File][callName].show=='YES');
            }


              $scope.openModalShowTabFields = function() {
                $modal.open({
                  templateUrl: 'views/ModalShowTabFields.html',
                  controller: 'ModalShowTabFieldsController',
                  scope: $scope
                });
              };

              $scope.openModalShowAllFields = function(result) {
                $scope.recordNum = result;
                console.log("Sono in openModalShowAllFields");
                $modal.open({
                  templateUrl: 'views/ModalShowAllFields.html',
                  controller: 'ModalShowFieldsController',
                  scope: $scope
                });
              };              

        }])           

        .controller ('ModalShowTabFieldsController',['$scope','$modal','$modalInstance','$localStorage','$window', function($scope,$modal,$modalInstance,$localStorage,$window) {

            $scope.listServer = JSON.parse($window.localStorage["ServerList"]); 

            $scope.ok = function (result) {
                console.log(result);
                 $localStorage.updateFileLayer('ServerList',$scope.listServer)
                 $modalInstance.close();
            }

            $scope.cancel = function () {
                console.log("Cancel");
                $modalInstance.dismiss('cancel');
            }


        }])

        .controller ('ModalShowFieldsController',['$scope','$modal','$modalInstance','$sessionStorage','$window','$location', function($scope,$modal,$modalInstance,$sessionStorage,$window,$location) {

            $scope.server = $location.search().server;
            $scope.logs = $sessionStorage.get($scope.server);

                    

            $scope.record = $scope.logs[$scope.activeLayer][$scope.activeDir][$scope.activeFile].Records[$scope.recordNum];
            console.log($scope.record);  

            $scope.ok = function (result) {
                console.log(result);
                 $modalInstance.close();
            }

            $scope.cancel = function () {
                console.log("Cancel");
                $modalInstance.dismiss('cancel');
            }


        }])
;
