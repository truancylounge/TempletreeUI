templetreeApp.controller('UserListController', ['$scope', '$http', '$uibModal', 'envService', function($scope, $http, $uibModal, envService) {

    $scope.users = [];
    $scope.roles = [];

    $scope.sortType = 'username'; // set the default sort type
    $scope.sortReverse  = false;  // set the default sort order
    
    $http.get(envService.read('loginUrl'))
      .success(function(data) {
        $scope.users = data;
      })
      .error(function(data, status, headers, config) {
        alert( "failure message: " + JSON.stringify({data: data}));
      });

    $http.get(envService.read('rolesUrl'))
      .success(function(data) {
        $scope.roles = data;
      })
      .error(function(data, status, headers, config) {
        alert( "failure message: " + JSON.stringify({data: data}));
      });

    $scope.deleteUser = function(i) {
      var deleteUrl = envService.read('loginUrl') + "/" + i.id;
      console.log("Delete Url: " + deleteUrl);
      $http.delete(deleteUrl)
        .success(function(data) {
          console.log("User deleted: " + i.username);
          $http.get(envService.read('loginUrl')).success(function(data) {
            $scope.users = data;
          });
        })
        .error(function(data, status, headers, config) {
          alert( "failure message: " + JSON.stringify({data: data}));
        });
    };

    $scope.editUserOpen = function(i) {
      console.log("Entering Edit User modal.");

      var modalInstance = $uibModal.open({
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
            return envService.read('loginUrl');
          }


        }
      });
    };
}]);

templetreeApp.controller('EditUserModalController', ['$scope', '$http', '$uibModalInstance', 'updatedUser', 'users', 'roles', 'loginUrl', function ($scope, $http, $uibModalInstance, updatedUser, users, roles, loginUrl) {
  
  console.log("Entering EditUser modal Controller");
  $scope.username = updatedUser.username;
  $scope.roles = roles;
  $scope.selectedRole = updatedUser.role;

  $scope.dropdownRoleSelected = function(role) {
    $scope.selectedRole = role;
  };    
  
  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
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

    $uibModalInstance.dismiss(updatedUser);
  };
}]);






   