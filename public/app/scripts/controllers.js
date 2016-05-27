'use strict';

angular.module('QLog')

.filter('custom', function() {
  return function(input, search) {
    if (!input) return input;
    if (!search) return input;
    var expected = ('' + search).toLowerCase();
    var result = {};
    angular.forEach(input, function(value, key) {
      var actual = ('' + value).toLowerCase();
      if (actual.indexOf(expected) !== -1) {
        result[key] = value;
      }
    });
    return result;
  }
})

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
                $state.reload();
            }
        }])        


        .controller('ServerController', ['$scope','logsViewFactory','$localStorage', '$sessionStorage', '$state',
            function($scope,logsViewFactory,$localStorage,$sessionStorage,$state) {
            
            $scope.layers = {};
            $scope.stat = {};
            $scope.numRecords = {}

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
                $state.reload();
            }

            $scope.getLayersLog = function (ServerName) {
                // Da qui richiamo in ciclo ricorsivo la getLayerLog

                var layer = $localStorage.getObject("ServerList",{});
                 this.getLayerLog(ServerName,'Engine');
            }      

            $scope.getLayerLog = function (ServerName,layer) {
                $scope.logs = logsViewFactory.getLog($scope.ServersList[ServerName].name).get({layer:layer})
                .$promise.then(
                    function(response){
                        $sessionStorage.store(ServerName,layer,response);
                        $localStorage.updateLayersStats(ServerName,layer,response);
                        //var thisLayer={};
                        //var thisLayer[ServerName] = "{Layer:layer}";
                        $scope.numRecords = 92;
                    },
                    function(response) {
                        console.log("Errore!");
                    }
                );
            } 
        }])  

        .controller('LogsViewController', ['$scope','$rootScope','$window','$localStorage','$sessionStorage','$modal','$location', 'logsViewFactory','$state',
            function($scope,$rootScope,$window,$localStorage,$sessionStorage,$modal,$location,logsViewFactory,$state) {
            

            $scope.server = $location.search().server;
            $scope.listServer = JSON.parse($window.localStorage["ServerList"]);

            $scope.logs = $sessionStorage.get($scope.server);
            console.log("Carico LogsViewController "+$scope.server);

            $scope.activeLayer = Object.keys($scope.logs)[0];
            $scope.activeDir = Object.keys($scope.logs[$scope.activeLayer])[0];
            $scope.activeFile = Object.keys($scope.logs[$scope.activeLayer][$scope.activeDir])[0];

            $scope.getLayerLog = function (ServerName,layer) {
                $scope.logs = logsViewFactory.getLog($scope.server).get({layer:$scope.activeLayer})
                .$promise.then(
                    function(response){
                        $sessionStorage.store($scope.server,$scope.activeLayer,response);
                        $localStorage.updateLayersStats($scope.server,$scope.activeLayer,response);
                        $state.reload();
                    },
                    function(response) {
                        console.log("Errore!");
                    }
                );
            }             


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
                   // $scope.listServer = JSON.parse($window.localStorage["ServerList"]);

                    return ($scope.listServer[$scope.server]["layers"][Layer][Dir][File][callName].show=='YES');
            }

            $scope.highlights = function(record) {
                if(record.Severity == 'WARN')
                    return('warning');

                if(record.Severity == 'ERROR')
                    return('danger');

                if(record.Level == 'WARN')
                    return('warning');

                if(record.Level == 'ERROR')
                    return('danger');
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
                console.log("Sono in openModalShowAllFields "+$scope.recordNum);
                $modal.open({
                  templateUrl: 'views/ModalShowAllFields.html',
                  controller: 'ModalShowFieldsController',
                  windowClass: 'app-modal-window',
                  scope: $scope
                });
              };              

        }])           

        .controller ('ModalShowTabFieldsController',['$scope','$modal','$modalInstance','$localStorage','$window','$state', 
            function($scope,$modal,$modalInstance,$localStorage,$window,$state) {

            $scope.listServer = JSON.parse($window.localStorage["ServerList"]); 

            $scope.ok = function (result) {
                console.log(result);
                 $localStorage.updateFileLayer('ServerList',$scope.listServer);
                 $state.reload();
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
            $scope.firstRecord=true;

                    

            $scope.record = $scope.logs[$scope.activeLayer][$scope.activeDir][$scope.activeFile].Records;  

            $scope.ok = function (result) {
                console.log(result);
                 $modalInstance.close();
            }

            $scope.cancel = function () {
                console.log("Cancel");
                $modalInstance.dismiss('cancel');
            }

            $scope.prevRecord = function () {
                if($scope.recordNum > 0)
                    $scope.recordNum --;
                else
                    $scope.firstRecord=false;

            }

            $scope.nextRecord = function () {
                if($scope.recordNum <= $scope.record.length)
                    $scope.recordNum ++;
                          
            }            

        }])
;
