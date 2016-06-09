templetreeApp.controller('AddItemController', ['$scope', '$http', 'envService', function($scope, $http, envService) {

    $scope.newItems = [];


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
      $scope.createItems(); 
    };

    /* Start of REST Call functions */

    $scope.successPOSTCallback = function(response) {
      $scope.newItems = [];
    };

    $scope.errorPOSTCallback = function(response) {
      alert( "failure message: " + JSON.stringify({data: response.data}));
    };     

    $scope.createItems = function() {
      $http({
        method: 'POST',
        url: envService.read('itemlistUrl'),
        data: $scope.newItems
      }).then($scope.successPOSTCallback, $scope.errorPOSTCallback);
    };

    /* End of REST Call functions */ 

    $scope.checkValidity = function() {
      return ($scope.newItems != undefined && 
        $scope.newItems.length > 0);
    };
    
}]);


   