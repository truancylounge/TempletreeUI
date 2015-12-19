var dependentApp = angular.module('dependency',[]);
dependentApp.factory('tokenHttpInterceptor', ['$q', '$window', function ($q, $window) {
        return {
            'request': function (config) {
              console.log('Request Interceptor: Adding token : ' + $window.sessionStorage.token);
              config.headers.Authorization = $window.sessionStorage.token;
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

var app = angular.module('customerList', ['ui.bootstrap', 'dependency'])
app.controller('CustomerListController', ['$scope', '$http', '$modal', function($scope, $http, $modal) {

    var initialize = $http.get('../../resources/config.json');

    initialize.success(function(data) {
      $scope.uiProperties = data;
      $http.get($scope.uiProperties.customerlistUrl)
        .success(function(data) {
          $scope.customers = data;
        })
        .error(function(data, status, headers, config) {
          alert( "failure message: " + JSON.stringify({data: data}));
        });
    });  

    $scope.updateCustomers = function() {
      console.log("Updating Customers.");
      var res = $http.put($scope.uiProperties.customerlistUrl, $scope.customers);
      res.success(function(data, status, headers, config) {
        // On Success retrieve all customers
        $http.get($scope.uiProperties.customerlistUrl).success(function(data) {
          $scope.customers = data;
        });
      });
      res.error(function(data, status, headers, config) {
        alert( "failure message: " + JSON.stringify({data: data}));
      });
    };

    $scope.revertCustomers = function() {
      console.log("Reverting Customers.");
      $http.get($scope.uiProperties.customerlistUrl).success(function(data) {
          $scope.customers = data;
      });
    }; 

    $scope.actionFilter = function(i) {
      return i.action == 'U' || i.action == 'I';
    };

    $scope.deleteCustomer = function(i) {
      console.log("Entering DeleteCustomer function.");
      $scope.customers.forEach(function(customer) {
        if(customer === i)
          customer.action = 'D';
      });
    };

    $scope.checkValidity = function() {
      // Looping through customers to find out if customer has been updated or deleted, if so enable Revert and Save buttons.
      var validity = false;
      
      for(var index in $scope.customers) {
        var customer = $scope.customers[index];
        if(customer.action == 'U' || customer.action =='D') {
          validity = true;
          break;
        }
      }
      
      return validity;
    };

    $scope.editCustomerOpen = function(i) {
      console.log("Entering EditCustomer modal.");
      var modalInstance = $modal.open({
        templateUrl: 'editCustomersModal.html',
        controller: 'EditCustomerModalController',
        resolve: {
          updatedCustomer: function() {
            return i;
          },
          customers: function() {
            return $scope.customers;
          }
        }
      });
    };
}]);

app.controller('EditCustomerModalController',[ '$scope', '$modalInstance', 'updatedCustomer', 'customers', function($scope, $modalInstance, updatedCustomer, customers) {
  console.log("Entering EditCustomer modal controller");

  $scope.name = updatedCustomer.name;
  $scope.email = updatedCustomer.email;
  $scope.telephoneNo = updatedCustomer.telephoneNo;

  $scope.updatedCustomer = updatedCustomer;
  $scope.customers = customers;

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };

  $scope.editCustomer = function() {

    // Looping through customers to find out customer to be updated and edi name/email or TelNo
    for(var index in customers) {
      var customer = customers[index];
      if(customer.name == updatedCustomer.name) {
        console.log("Updating email and telephoneNo for Customer with name: " + customer.name);
        customer.email = $scope.email;
        customer.telephoneNo = $scope.telephoneNo;
        customer.action = 'U';
      }
    }
    $modalInstance.dismiss(updatedCustomer);
  };

}]);

