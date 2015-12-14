var app = angular.module('itemList', ['ui.bootstrap'])
app.controller('ItemListController', ['$scope', '$http', '$modal', '$window', function($scope, $http, $modal, $window) {

    var initialize = $http.get('../../resources/config.json');

    initialize.success(function(data) {
      $scope.uiProperties = data;
      console.log("Token acquired : " + $window.sessionStorage.token);  
      $http({
        method: 'GET',
        url: $scope.uiProperties.itemlistUrl + "?token=" + $window.sessionStorage.token
      }).then(function successCallback(response) {
        $scope.items = response.data;
        $window.sessionStorage.token = response.headers('X-Templteree-Auth-Token');
        }, function errorCallback(response) {
          if(response.status == 403) {
            console.log("Redirecting to login page! Invalid Token.");
            $window.location.href = '../sign_in.html';
          }
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

    $scope.checkValidity = function() {
      // Looping through items to find out if item has been updated or deleted, if so enable Revert and Save buttons.
      var validity = false;
      
      for(var index in $scope.items) {
        var item = $scope.items[index];
        if(item.action == 'U' || item.action =='D') {
          validity = true;
          break;
        }
      }      
      return validity;
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




   