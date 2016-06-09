templetreeApp.controller('AddCustomerController', ['$scope', '$http', 'envService', function($scope, $http, envService) {

	$scope.newCustomers = [];  

  $scope.addCustomer = function() {
    $scope.newCustomers.push({"name": $scope.name, "email": $scope.email, "telephoneNo": $scope.telephoneNo});
    console.log("Adding new Customer: " + $scope.name)    
    $scope.name = null;
    $scope.email = null;
    $scope.telephoneNo = null;
  };

  $scope.updateCustomers = function() {
  	console.log("Updating Customers.");
  	var res = $http.post(envService.read('customerlistUrl'), $scope.newCustomers);
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
  $scope.checkValidity = function() {
    return ($scope.newCustomers != undefined && 
      $scope.newCustomers.length > 0);
  };
}]);