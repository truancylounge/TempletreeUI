var dependentApp = angular.module('dependency',[]);
dependentApp.factory('tokenHttpInterceptor', ['$q', '$window', function ($q, $window) {
        return {
            'request': function (config) {
              console.log('Request Interceptor: Adding token : ' + $window.sessionStorage.token);
              config.headers.Authorization = $window.sessionStorage.token;
              if($window.sessionStorage.token === undefined) {
                console.log("Undefined token, redirecting to login");
                $window.location.href = '../sign_in.html';
              }
              return config;
            },

            'response': function (response) {              
              console.log('Response Interceptor: New Token: ' + response.headers('X-Templteree-Auth-Token') );
              $window.sessionStorage.token = response.headers('X-Templteree-Auth-Token') || $window.sessionStorage.token;
              return response;
            },
            'responseError': function(response) {
              if(response.status === 403) {
                console.log("Redirecting to login page! Invalid Token.");
                $window.location.href = '../sign_in.html';
              }
              return response;  
            }
        };
}]);
dependentApp.config(['$httpProvider', function($httpProvider) {
  $httpProvider.interceptors.push('tokenHttpInterceptor');
}]);

var app = angular.module('itemList', ['ui.bootstrap', 'dependency']);
app.controller('ItemListController', ['$scope', '$http', '$modal', '$window', function($scope, $http, $modal, $window) {

    var initialize = $http.get('../../resources/config.json');

    initialize.success(function(data) {
      $scope.uiProperties = data;  
      $scope.retriveAllItems();
      $scope.sortType = 'barcode'; // set the default sort type
      $scope.sortReverse  = false;  // set the default sort order
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
        url: $scope.uiProperties.itemlistUrl
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
        url: $scope.uiProperties.itemlistUrl,
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




   