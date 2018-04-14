angular.module('myApp', ['io.service', 'ngRoute']).

  run(function (io) {
    io.init({
      ioServer: 'http://localhost:3696',
    });
  }).

  controller('SettingsController', function($scope, $location){

    $scope.$location = $location;
    $scope.defaultChatName = 'miniChat Room';

    $scope.go = function go() {
      if(angular.isUndefined($scope.chatname)){
        return $scope.$location.path('/chat/' + $scope.defaultChatName + '/' + $scope.username);
      } else {
        return $scope.$location.path('/chat/' + $scope.chatname + '/' + $scope.username);
      }
    }

  }).

  controller('MainController', function ($scope, io, $route, $routeParams, $location) {
    $scope.$route       = $route;
    $scope.username     = $routeParams.username;
    $scope.chatroomName = $routeParams.chatname;
    $scope.$location    = $location;
    $scope.msglog       = [];
    /* $scope.$watch('message', function () {
      $scope.disabled = (($scope.message !== null) && (!angular.isUndefined($scope.message))) ? false : true;
    }); */

    $scope.send = function () {
      $scope.text.timestamp = new Date().toLocaleString();
      io.emit({
        message: $scope.text.message,
        timestamp: $scope.text.timestamp
      });
      $scope.msglog.push(angular.copy($scope.text));
      delete $scope.text;
    }

    io.watch('message', function (data) {
      $scope.$apply();
    });
  }).

  config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: '/view/chatSettings.html',
        controller: 'SettingsController'
      })
      .when('/chat/:chatname/:username', {
        templateUrl: '/view/chat.html',
        controller: 'MainController'
/*         resolve: {
          chatName: function(chatname){
              $scope.chatName = chatname || 'miniChat Room';
              return $scope.chatName;
          },
          userName: function(username){
              return username;
          }
        } */
      });
    $locationProvider.html5Mode(true);
  });
