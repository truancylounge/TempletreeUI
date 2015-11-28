var app = angular.module('itemList', ['ui.bootstrap'])
app.controller('ItemListController', ['$scope', '$http', '$modal', function($scope, $http, $modal) {

    var initialize = $http.get('../../resources/config.json');

    initialize.success(function(data) {
      $scope.uiProperties = data;
      $http.get($scope.uiProperties.itemlistUrl)
        .success(function(data) {
          $scope.items = data;
        })
        .error(function(data, status, headers, config) {
          alert( "failure message: " + JSON.stringify({data: data}));
        });
    });

    $scope.deleteItem = function(i) {
      console.log("Entering deleteItem function.");
      $scope.items.forEach(function(item) {
        if(item.barcode === i.barcode) {
          item.action = 'D';
        };
      });
    };

    $scope.actionFilter = function(i) {
      return i.action == 'U' || i.action == 'I';
    };

    $scope.updateItems = function() {
      console.log("Updating items.");
      var res = $http.put($scope.uiProperties.itemlistUrl, $scope.items);
      res.success(function(data, status, headers, config) {
        // On Success retrieve all items
        $http.get($scope.uiProperties.itemlistUrl).success(function(data) {
          $scope.items = data;
        });
      });
      res.error(function(data, status, headers, config) {
        alert( "failure message: " + JSON.stringify({data: data}));
      });   
    };

    $scope.revertItems = function() {
      console.log("Reverting items.");
      $http.get($scope.uiProperties.itemlistUrl).success(function(data) {
          $scope.items = data;
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
            item.action = 'U';       
          }
        }
      }

      $modalInstance.dismiss(updatedItem);

  };
}]);




   