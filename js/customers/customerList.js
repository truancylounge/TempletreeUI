var app = angular.module('customerList', ['ui.bootstrap'])
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

