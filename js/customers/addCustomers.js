var app = angular.module('addCustomer', [])
app.controller('AddCustomerController', ['$scope', '$http', function($scope, $http) {

	var initialize = $http.get('../../resources/config.json');
  $scope.newCustomers = [];  

  initialize.success(function(data) {
    $scope.uiProperties = data;
  });

  $scope.addCustomer = function() {
    $scope.newCustomers.push({"name": $scope.name, "email": $scope.email, "telephoneNo": $scope.telephoneNo});
    console.log("Adding new Customer: " + $scope.name)    
    $scope.name = null;
    $scope.email = null;
    $scope.telephoneNo = null;
  };

  $scope.updateCustomers = function() {
  	console.log("Updating Customers.");
  	var res = $http.post($scope.uiProperties.customerlistUrl, $scope.newCustomers);
  	res.success(function(data, status, headers, config) {
      // On Success retrieve all customers
      $scope.newCustomers = [];
    });
    res.error(function(data, status, headers, config) {
      alert( "failure message: " + JSON.stringify({data: data}));
    });
  };

  $scope.deleteCustomer = function(i) {
    console.log("Entering DeleteCustomer function, delete customer name : " + i.name);
    $scope.newCustomers = $scope.newCustomers.filter(function(customer) {
      return customer !== i;
    });
  };
}]);