var app = angular.module('item', ['ui.bootstrap'])
app.controller('ItemController', ['$scope', '$http', '$modal', function($scope, $http, $modal) {
    var resGet = $http.get('http://localhost:8080/Templetree/rest/items/');

    resGet.success(function(data) {
      $scope.items = data;
    });

    resGet.error(function(data, status, headers, config) {
        alert( "failure message: " + JSON.stringify({data: data}));
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
      console.log("Entering Add Items modal.");

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

    $scope.deleteItem = function(i) {
      console.log("Entering deleteItem function.");
      $scope.items = $scope.items.filter(function(item) {
        return item.barcode !== i.barcode;
      });
    };

    $scope.editItemOpen = function(i) {
      console.log("Entering EditItem modal.");

      var modalInstance = $modal.open({
        templateUrl: 'editItemsModal.html',
        controller: 'EditItemModalController',
        resolve: {
          updatedItem: function () {
            return i;
          },
          items: function() {
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

app.controller('EditItemModalController', ['$scope', '$modalInstance', 'updatedItem', 'items', function ($scope, $modalInstance, updatedItem, items) {
  
  console.log("Entering EditItem modal Controller");
  $scope.itemName = updatedItem.itemName;
  $scope.quantity = updatedItem.quantity;
  $scope.salesPrice = updatedItem.salesPrice;
  $scope.purchasePrice = updatedItem.purchasePrice;

  $scope.updatedItem = updatedItem;
  $scope.items = items;

  
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

  $scope.editItem = function() {

      // Looping through items to find out the item to be updated and edit itemName and quantity.
      for(var index in items) {
        var item = items[index];
        for(var property in item) {
          if (item.hasOwnProperty(property) && property == "barcode" && item[property] == updatedItem.barcode ) {
            console.log("Updating itemName and quantity for item with barcode: " + item.barcode);
            item.itemName = $scope.itemName;
            item.salesPrice = $scope.salesPrice;
            item.purchasePrice = $scope.purchasePrice;
            item.quantity = $scope.quantity;        
          }
        }
      }

      $modalInstance.dismiss(updatedItem);

  };
}]);

