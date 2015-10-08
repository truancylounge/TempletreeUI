(function(angular) {
  'use strict';
angular.module('item', [])
  .controller('ItemController', ['$scope', '$http', function($scope, $http) {
    $http.get('http://localhost:8080/Templetree/rest/items/').success(function(data) {
      $scope.items = data;
    });
    $scope.addItems = function() {
      $scope.products.push({"barcode": $scope.barcode, "category" : $scope.category, "itemName": $scope.itemName, "salesPrice": $scope.salesPrice, "purchasePrice": $scope.purchasePrice, "quantity": $scope.quantity});
    };
  }]);
})(window.angular);