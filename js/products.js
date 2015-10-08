(function(angular) {
  'use strict';
angular.module('product', [])
  .controller('ProductController', ['$scope', '$http', function($scope, $http) {
    $http.get('http://localhost:8080/InventoryManagementSystem/rest/products/').success(function(data) {
      $scope.products = data;
    });
    $scope.productName;
    $scope.productCode;   
    $scope.productType;    
    $scope.sellingRate;
    $scope.costRate;
    $scope.addProducts = function() {
      $scope.products.push({"productName": $scope.productName, "productCode" : $scope.productCode, "productType": $scope.productType, "sellingRate": $scope.sellingRate, "costRate": $scope.costRate});
    };
  }]);
})(window.angular);