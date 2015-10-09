var app = angular.module('item', ['ui.bootstrap'])
app.controller('ItemController', ['$scope', '$http', '$modal', function($scope, $http, $modal) {
    $http.get('http://localhost:8080/Templetree/rest/items/').success(function(data) {
      $scope.items = data;
    });

    $scope.updateItems = function() {
      console.log("Updating items.");
      var res = $http.post('http://localhost:8080/Templetree/rest/items/', $scope.items);
      res.success(function(data, status, headers, config) {
        // On Success retrieve all items
        $http.get('http://localhost:8080/Templetree/rest/items/').success(function(data) {
          $scope.items = data;
        });
      });
      res.error(function(data, status, headers, config) {
        alert( "failure message: " + JSON.stringify({data: data}));
      });   
    };

    $scope.revertItems = function() {
      console.log("Reverting items.");
      $http.get('http://localhost:8080/Templetree/rest/items/').success(function(data) {
          $scope.items = data;
      });
    };

    $scope.open = function () {
      //alert("I am an alert box!");
      console.log("Inside Add Items modal.");

      var modalInstance = $modal.open({
        templateUrl: 'addItemsModal.html',
        controller: 'ItemModalController',
        resolve: {
        items: function () {
          return $scope.items;
        }
      }
      });
    };
}]);

app.controller('ItemModalController', function ($scope, $modalInstance, items) {

  $scope.items = items;

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

  $scope.addItems = function() {
      $scope.items.push({"barcode": $scope.barcode, "category" : $scope.category, "itemName": $scope.itemName, "salesPrice": $scope.salesPrice, "purchasePrice": $scope.purchasePrice, "quantity": $scope.quantity});
      console.log("Adding item with barcode : " + $scope.barcode);
      $modalInstance.dismiss('save');
  };
});

