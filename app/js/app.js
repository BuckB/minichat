angular.module('myApp', ['io.service']).

  run(function (io) {
    io.init({
      ioServer: 'http://localhost:3696',
    });
  }).

  controller('MainController', function ($scope, io) {

    $scope.msglog = [];
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
      delete $scope.text.message;
      delete $scope.text.timestamp;
    }

    io.watch('message', function (data) {
      $scope.$apply();
    });
  });
