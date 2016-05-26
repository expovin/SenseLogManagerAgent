'use strict';

angular.module('QLog', ['ui.router','ngResource','ui.bootstrap'])
.config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
        
            // route for the home page
            .state('app', {
                url:'/',
                views: {
                    'header': {
                        templateUrl : 'views/header.html',
                        controller  : 'HeaderController'
                    },
                    'content@': {
                        templateUrl : 'views/Home.html',
                        controller  : 'ServerController'
                    },
                    'footer': {
                        templateUrl : 'views/footer.html',
                    }
                }                
            })
        
        

            // route for the menu page
            .state('app.LogsView', {
                url: 'LogsView?server',
                views: {
                    'content@': {
                        templateUrl : 'views/LogsView.html',
                        controller  : 'LogsViewController'
                    }
                }
            })

    
        $urlRouterProvider.otherwise('/');
    })
;
