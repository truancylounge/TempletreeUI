var app = angular.module('addUser', [])
app.controller('AddUserController', ['$scope', '$http', function($scope, $http) {

	var initialize = $http.get('../../resources/config.json');
  
  initialize.success(function(data) {
    $scope.uiProperties = data;
      $http.get($scope.uiProperties.rolesUrl)
        .success(function(data) {
          $scope.roles = data;
        })
        .error(function(data, status, headers, config) {
          alert( "failure message: " + JSON.stringify({data: data}));
        });

  });

  $scope.addUser = function() {
    console.log("Adding User Credentials.");
    var newUser = new Object();
    newUser.username = $scope.username;
    newUser.password = $scope.password;
    newUser.role = $scope.selectedRole;

    var res = $http.post($scope.uiProperties.loginUrl, newUser);
    res.success(function(data, status, headers, config) {
      // On Success retrieve all customers
      console.log("NewUser successfully added.");
      $scope.username = null;
      $scope.password = null;
      $scope.selectedRole = null;
    });
    res.error(function(data, status, headers, config) {
      alert( "failure message: " + JSON.stringify({data: data}));
    });    
  };

  $scope.dropdownRoleSelected = function(role) {
    $scope.selectedRole = role;
  };  
}]);