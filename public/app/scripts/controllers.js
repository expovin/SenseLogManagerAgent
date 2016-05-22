'use strict';

angular.module('QLog')
        .controller('HeaderController', ['$scope','$window','$localStorage', function($scope,$window,$localStorage) {

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

        .controller('LogsViewController', ['$scope','$window','$localStorage','$sessionStorage','$modal', function($scope,$window,$localStorage,$sessionStorage,$modal) {

            $scope.logs = $sessionStorage.get('localhost');

            $scope.activeLayer = Object.keys($scope.logs)[0];
            $scope.activeDir = Object.keys($scope.logs[$scope.activeLayer])[0];
            $scope.activeFile = Object.keys($scope.logs[$scope.activeLayer][$scope.activeDir])[0];

            console.log("activeLayer "+$scope.activeLayer);
            console.log("activeDir "+$scope.activeDir);
            console.log("activeFile "+$scope.activeFile);

            $scope.selectLayer = function (layerName) {
                console.log("Selezionato Layer "+layerName);
                $scope.activeLayer = layerName;
                $scope.activeDir = Object.keys($scope.logs[$scope.activeLayer])[0];
                $scope.activeFile = Object.keys($scope.logs[$scope.activeLayer][$scope.activeDir])[0];                
            }

            $scope.selectDir = function (dirName) {
                console.log("Selezionata dir "+dirName);
                $scope.activeDir = dirName;
                $scope.activeFile = Object.keys($scope.logs[$scope.activeLayer][$scope.activeDir])[0];
            }      

            $scope.selectFile = function (fileName) {
                console.log("Selezionata file "+fileName);
                $scope.activeFile = fileName;
            }      

            $scope.showColl = function(Layer,Dir,File,callName){
                    $scope.listServer = JSON.parse($window.localStorage["ServerList"]);
                    return ($scope.listServer["localhost"]["layers"][Layer][Dir][File][callName].show=='YES');
            }


              $scope.open = function() {
                $modal.open({
                  templateUrl: 'views/ModalShowTabFields.html',
                  controller: 'ModalShowFieldsController',
                  scope: $scope
                });
              };

        }])           

        .controller ('ModalShowFieldsController',['$scope','$modal','$modalInstance','$localStorage','$window', function($scope,$modal,$modalInstance,$localStorage,$window) {

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

;
