templetreeApp.controller('CustomerListController', ['$scope', '$http', '$uibModal', 'envService', function($scope, $http, $uibModal, envService) {

    $scope.customers = [];
    
    $scope.sortType = 'name'; // set the default sort type
    $scope.sortReverse  = false;  // set the default sort order
    
    $http.get(envService.read('customerlistUrl'))
      .success(function(data) {
        $scope.customers = data;
      })
      .error(function(data, status, headers, config) {
        alert( "failure message: " + JSON.stringify({data: data}));
      });
    
    $scope.updateCustomers = function() {
      console.log("Updating Customers.");
      var res = $http.put(envService.read('customerlistUrl'), $scope.customers);
      res.success(function(data, status, headers, config) {
        // On Success retrieve all customers
        $http.get(envService.read('customerlistUrl')).success(function(data) {
          $scope.customers = data;
        });
      });
      res.error(function(data, status, headers, config) {
        alert( "failure message: " + JSON.stringify({data: data}));
      });
    };

    $scope.revertCustomers = function() {
      console.log("Reverting Customers.");
      $http.get(envService.read('customerlistUrl')).success(function(data) {
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
      var modalInstance = $uibModal.open({
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

templetreeApp.controller('EditCustomerModalController',[ '$scope', '$uibModalInstance', 'updatedCustomer', 'customers', function($scope, $uibModalInstance, updatedCustomer, customers) {
  console.log("Entering EditCustomer modal controller");

  $scope.name = updatedCustomer.name;
  $scope.email = updatedCustomer.email;
  $scope.telephoneNo = updatedCustomer.telephoneNo;

  $scope.updatedCustomer = updatedCustomer;
  $scope.customers = customers;

  $scope.cancel = function() {
    $uibModalInstance.dismiss('cancel');
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
    $uibModalInstance.dismiss(updatedCustomer);
  };

}]);

