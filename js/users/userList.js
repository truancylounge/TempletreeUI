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

var app = angular.module('userList', ['ui.bootstrap', 'dependency'])
app.controller('UserListController', ['$scope', '$http', '$modal', function($scope, $http, $modal) {

    var initialize = $http.get('../../resources/config.json');

    initialize.success(function(data) {
      $scope.uiProperties = data;
      $scope.sortType = 'username'; // set the default sort type
      $scope.sortReverse  = false;  // set the default sort order
      $http.get($scope.uiProperties.loginUrl)
        .success(function(data) {
          $scope.users = data;
        })
        .error(function(data, status, headers, config) {
          alert( "failure message: " + JSON.stringify({data: data}));
        });
      $http.get($scope.uiProperties.rolesUrl)
        .success(function(data) {
          $scope.roles = data;
        })
        .error(function(data, status, headers, config) {
          alert( "failure message: " + JSON.stringify({data: data}));
        });


    });

    $scope.deleteUser = function(i) {
      var deleteUrl = $scope.uiProperties.loginUrl + "/" + i.id;
      console.log("Delete Url: " + deleteUrl);
      $http.delete(deleteUrl)
        .success(function(data) {
          console.log("User deleted: " + i.username);
          $http.get($scope.uiProperties.loginUrl).success(function(data) {
            $scope.users = data;
          });
        })
        .error(function(data, status, headers, config) {
          alert( "failure message: " + JSON.stringify({data: data}));
        });
    };

    $scope.editUserOpen = function(i) {
      console.log("Entering Edit User modal.");

      var modalInstance = $modal.open({
        templateUrl: 'editUsersModal.html',
        controller: 'EditUserModalController',
        resolve: {
          updatedUser: function () {
            return i;
          },
          users: function() {
            return $scope.users;
          },
          roles: function() {
            return $scope.roles;
          },
          loginUrl: function() {
            return $scope.uiProperties.loginUrl;
          }


        }
      });
    };
}]);

app.controller('EditUserModalController', ['$scope', '$http', '$modalInstance', 'updatedUser', 'users', 'roles', 'loginUrl', function ($scope, $http, $modalInstance, updatedUser, users, roles, loginUrl) {
  
  console.log("Entering EditUser modal Controller");
  $scope.username = updatedUser.username;
  $scope.roles = roles;
  $scope.selectedRole = updatedUser.role;

  $scope.dropdownRoleSelected = function(role) {
    $scope.selectedRole = role;
  };    
  
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

  $scope.editUser = function() {
    updatedUser.role = $scope.selectedRole;
    updatedUser.password = $scope.password;

    var putUrl = loginUrl + "/" + updatedUser.id;
    console.log("Put Url: " + putUrl);

    var res = $http.put(putUrl, updatedUser);
    res.success(function(data, status, headers, config) {
      // On Success retrieve all customers
      console.log("User successfully updated");
    });
    res.error(function(data, status, headers, config) {
      alert( "failure message: " + JSON.stringify({data: data}));
    });  

    $modalInstance.dismiss(updatedUser);
  };
}]);






   