var app = angular.module('customer', ['ui.bootstrap'])
app.controller('CustomerController', ['$scope', '$http', '$modal', function($scope, $http, $modal) {

	var initialize = $http.get('../resources/config.json');

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
    	var res = $http.post($scope.uiProperties.customerlistUrl, $scope.customers);
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

    $scope.open = function() {
    	console.log("Entering Add Customers Modal.");
    	var modalinstance = $modal.open({
    		templateUrl: 'addCustomersModal.html',
    		controller: 'CustomerModalController',
    		resolve: {
    			customers: function() {
    				return $scope.customers;
    			}
    		}
    	});
    };

    $scope.deleteCustomer = function(i) {
      console.log("Entering DeleteCustomer function.");
      $scope.customers = $scope.customers.filter(function(customer) {
        return ((customer.name !== i.name) && (customer.email !== i.email) && (customer.telephoneNo !== i.telephoneNo));
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

app.controller('CustomerModalController', function($scope, $modalInstance, customers) {
	$scope.customers = customers;

	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	};

	$scope.addCustomers = function() {
		$scope.customers.push({"name": $scope.name, "email": $scope.email, "telephoneNo": $scope.telephoneNo});
		console.log("Adding new Customer: " + $scope.name);
		$modalInstance.dismiss('save');
	};
});

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
      }
    }
    $modalInstance.dismiss(updatedCustomer);
  };

}]);

