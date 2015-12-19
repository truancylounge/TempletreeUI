var dependentApp = angular.module('dependency',[]);
dependentApp.factory('tokenHttpInterceptor', ['$q', '$window', function ($q, $window) {
        return {
            'request': function (config) {
              console.log('Request Interceptor: Adding token : ' + $window.sessionStorage.token);
              config.headers.Authorization = $window.sessionStorage.token;
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

var app = angular.module('addItem', ['dependency'])
app.controller('AddItemController', ['$scope', '$http', '$window', function($scope, $http, $window) {

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
        url: $scope.uiProperties.itemlistUrl,
        data: $scope.newItems
      }).then($scope.successPOSTCallback, $scope.errorPOSTCallback);
    };

    /* End of REST Call functions */ 

    $scope.checkValidity = function() {
      return ($scope.newItems != undefined && 
        $scope.newItems.length > 0);
    };
    
}]);


   