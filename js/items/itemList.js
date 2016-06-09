templetreeApp.controller('ItemListController', ['$scope', '$http', '$uibModal', 'envService', function($scope, $http, $uibModal, envService) {

    // Debug Environment variables 
    //$scope.environment = envService.get();
    //console.log('Current env: ' + $scope.environment);
    //$scope.vars = envService.read('all');
    //console.log($scope.vars);


    $scope.items = [];
    $scope.sortType = 'barcode'; // set the default sort type
    $scope.sortReverse  = false;  // set the default sort order


    // Pagination attributes
    $scope.currentPage = envService.read('currentPage');
    $scope.itemsPerPage = envService.read('itemsPerPage');
    $scope.maxSize = envService.read('maxSize');
      
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
      $scope.saveItems();   
    };

    $scope.revertItems = function() {
      console.log("Reverting items.");
      $scope.retriveAllItems();
    };

    /* Start of REST Call functions */

    $scope.successGETCallback = function(response) {
      $scope.items = response.data;
    };

    $scope.errorGETCallback = function(response) {
      alert( "failure message: " + JSON.stringify({data: response.data}));
    };

    $scope.retriveAllItems = function() {
      $http({
        method: 'GET',
        url: envService.read('itemlistUrl')
      }).then($scope.successGETCallback, $scope.errorGETCallback);      
    };

    $scope.successPUTCallback = function(response) {
      $scope.retriveAllItems();
    };

    $scope.errorPUTCallback = function(response) {
      alert( "failure message: " + JSON.stringify({data: response.data}));
    };    

    $scope.saveItems = function() {
      $http({
        method: 'PUT',
        url: envService.read('itemlistUrl'),
        data: $scope.items
      }).then($scope.successPUTCallback, $scope.errorPUTCallback);
    };
    /* End of REST Call functions */    


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

      var modalInstance = $uibModal.open({
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


  $scope.retriveAllItems();
    
}]);

templetreeApp.controller('EditItemModalController', ['$scope', '$uibModalInstance', 'updatedItem', 'items', function ($scope, $uibModalInstance, updatedItem, items) {
  
  console.log("Entering EditItem modal Controller");
  $scope.itemName = updatedItem.itemName;
  $scope.quantity = updatedItem.quantity;
  $scope.salesPrice = updatedItem.salesPrice;
  $scope.purchasePrice = updatedItem.purchasePrice;

  $scope.updatedItem = updatedItem;
  $scope.items = items;

  
  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
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

      $uibModalInstance.dismiss(updatedItem);

  };
}]);




   