
var app = angular.module('login', []);
app.controller('LoginController', ['$scope', '$http', '$window', function($scope, $http, $window) {

	var initialize = $http.get('../resources/config.json');
    initialize.success(function(data) {
      console.log("Login initialize success!");
      $scope.uiProperties = data;
      $scope.user = {};
    });


    $scope.authenticate = function() {
      console.log("Authenticating user :  " + $scope.username);
      $scope.user.username = $scope.username;
      $scope.user.password = $scope.password;
      var res = $http.post($scope.uiProperties.authenticateUrl, $scope.user);
      res.success(function(data, status, headers, config) {
        // On Success get token and store it in local session.
        if(data.authenticated) {
        	console.log("Token acquired : " + $window.sessionStorage.token);      
        	$window.sessionStorage.token = data.token;
        	$window.location.href = '../dashboard.html';
        } else {
        	alert("Invalid UserName");
        }
        
      });
      res.error(function(data, status, headers, config) {
        alert( "failure message: " + JSON.stringify({data: data}));
      });    
    };
}]);