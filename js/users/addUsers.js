var dependentApp = angular.module('dependency',[]);
dependentApp.factory('tokenHttpInterceptor', ['$q', '$window', function ($q, $window) {
        return {
            'request': function (config) {
              console.log('Request Interceptor: Adding token : ' + $window.sessionStorage.token);
              config.headers.Authorization = $window.sessionStorage.token;
              if($window.sessionStorage.token === undefined) {
                console.log("Undefined token, redirecting to login");
                $window.location.href = '../sign_in.html';
              }
              return config;
            },

            'response': function (response) {              
              console.log('Response Interceptor: New Token: ' + response.headers('X-Templteree-Auth-Token') );
              $window.sessionStorage.token = response.headers('X-Templteree-Auth-Token') || $window.sessionStorage.token;
              return response;
            },
            'responseError': function(response) {
              if(response.status === 403) {
                console.log("Redirecting to login page! Invalid Token.");
                $window.location.href = '../sign_in.html';
              }
              return response;  
            }
        };
}]);
dependentApp.config(['$httpProvider', function($httpProvider) {
  $httpProvider.interceptors.push('tokenHttpInterceptor');
}]);

var app = angular.module('addUser', ['dependency'])
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