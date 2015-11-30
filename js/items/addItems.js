var app = angular.module('addItem', [])
app.controller('AddItemController', ['$scope', '$http', function($scope, $http) {

    var initialize = $http.get('../../resources/config.json');
    $scope.newItems = [];

    initialize.success(function(data) {
      $scope.uiProperties = data;
    });


    // Methods for addItems.html

    $scope.addItem = function() {
      $scope.newItems.push({"barcode": $scope.barcode, "category" : $scope.category, "itemName": $scope.itemName, "salesPrice": $scope.salesPrice, "purchasePrice": $scope.purchasePrice, "quantity": $scope.quantity});
      console.log("Adding item with barcode : " + $scope.barcode);
      $scope.barcode = null;
      $scope.category = null
      $scope.itemName = null
      $scope.salesPrice = null
      $scope.purchasePrice = null
      $scope.quantity = null
    };

    $scope.deleteAddedItem = function(i) {
      console.log("Entering deleteItem function.");
      $scope.newItems = $scope.newItems.filter(function(item) {
        return item.barcode !== i.barcode;
      });
    };

    $scope.insertItems = function() {
      console.log("Insert New Items.");
      var res = $http.post($scope.uiProperties.itemlistUrl, $scope.newItems);
      res.success(function(data, status, headers, config) {
        // On Success retrieve all items
        $scope.newItems = [];
      });
      res.error(function(data, status, headers, config) {
        alert( "failure message: " + JSON.stringify({data: data}));
      });   
    };

    $scope.checkValidity = function() {
      return ($scope.newItems != undefined && 
        $scope.newItems.length > 0);
    };
    
}]);


   