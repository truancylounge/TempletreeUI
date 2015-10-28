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

