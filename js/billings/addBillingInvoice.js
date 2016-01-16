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

var app = angular.module('addBilling', ['ui.bootstrap', 'dependency']);
app.controller('AddBillingController', ['$scope', '$http','$modal', function($scope, $http, $modal) {

  var initialize = $http.get('../../resources/config.json');

    initialize.success(function(data) {
      console.log("Entering Intialize");
      $scope.uiProperties = data;
      $scope.billingInvoice = {};
      $scope.billingInvoice.billingInvoicesItemsList = [];
      $scope.billingInvoice.totalAmount = 0;

      $http.get($scope.uiProperties.itemlistUrl)
        .success(function(data) {
          $scope.items = data;
        })
        .error(function(data, status, headers, config) {
          alert( "failure message: " + JSON.stringify({data: data}));
        });

      $http.get($scope.uiProperties.customerlistUrl)
        .success(function(data) {
          $scope.customers = data;
        })
        .error(function(data, status, headers, config) {
          alert( "failure message: " + JSON.stringify({data: data}));
        });

    });

    $scope.dropdownItemSelected = function(item) {
      $scope.selectedItem = item;
      $scope.quantity = 1;
    }; 
    
  $scope.addItems = function() {
    console.log("Adding new Item: " + $scope.selectedItem.itemName);
    $scope.billingInvoice.totalAmount = $scope.billingInvoice.totalAmount + ($scope.selectedItem.salesPrice * $scope.quantity);
    $scope.billingInvoice.billingInvoicesItemsList.push({"barcode": $scope.selectedItem.barcode, "itemName" : $scope.selectedItem.itemName, "salesPrice" : $scope.selectedItem.salesPrice, "quantity" : $scope.quantity, "total" : $scope.selectedItem.salesPrice * $scope.quantity});
    $scope.quantity = 1;
    console.log("Total amount" + $scope.billingInvoice.totalAmount);
    $scope.selectedItem = null;
  };       

    $scope.createBillingInvoice = function() {
      console.log("Creating a new Billing Invoice");
      var res = $http.post($scope.uiProperties.billingInvoicelistUrl, $scope.billingInvoice);
      $scope.billingInvoice = {};
      $scope.billingInvoice.billingInvoicesItemsList = [];
      $scope.billingInvoice.totalAmount = 0;
    };

    // Allowing the AddItem button on ly if an item has been selected.
    $scope.checkMyFormValidity = function() {
      return ((typeof $scope.selectedItem != "undefined") && ($scope.selectedItem != null));
    };

    // Allowing SelectPaymentType and Add Customer Details buttons to be selected if items are added to Purchased list.
    // Error being thrown coz billingInvoice hasn't been initialized until initialize.success() hence adding this condition.
    $scope.checkPurchaseItemsValidity = function() {
      return typeof($scope.billingInvoice) !== 'undefined' && $scope.billingInvoice.billingInvoicesItemsList.length > 0;
    };

    // Enabling Bill Invoice button only if cash + credit = totalAmount
    $scope.checkBillInvoiceValidity = function() {
      //unary plus operator to convert them to numbers first.
      // Error being thrown coz billingInvoice hasn't been initialized until initialize.success() hence adding this condition.
      return typeof($scope.billingInvoice) !== 'undefined' && (+$scope.billingInvoice.cash + +$scope.billingInvoice.credit == +$scope.billingInvoice.totalAmount);
    };

    $scope.selectPaymentTypeOpen = function() {
      console.log("Entering Select Payment Type Modal.");

      var modalInstance = $modal.open({
        templateUrl: 'selectPaymentTypeModal.html',
        controller: 'SelectPaymentTypeModalController',
        resolve: {
          billingInvoice: function() {
            return $scope.billingInvoice;
          }          
        }
      });
    };

    $scope.addCustomerDetailsOpen = function() {
      console.log("Entering Add Customer Details Modal.");

      var modalInstance = $modal.open({
        templateUrl: 'addCustomerDetailsModal.html',
        controller: 'AddCustomerDetailsModalController',
        resolve: {
          billingInvoice: function() {
            return $scope.billingInvoice;
          },
          customers: function() {
            return $scope.customers;
          }
        }
      });
    };
}]);

app.controller('SelectPaymentTypeModalController', function($scope, $modalInstance, billingInvoice) {
  $scope.billingInvoice = billingInvoice;
  $scope.cash = 0;
  $scope.credit = 0;

  // Enabling AddPaymentType modal button only if cash + credit = totalAmount
  $scope.checkSelectPaymentValidity = function() {
    //unary plus operator to convert them to numbers first.
    return ((+$scope.cash + +$scope.credit) == +billingInvoice.totalAmount);
  };


  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };

  $scope.addPaymentType = function() {
    $scope.billingInvoice.cash = $scope.cash;
    $scope.billingInvoice.credit = $scope.credit;

    $modalInstance.close($scope.totalAmount);
  };
});

app.controller('AddCustomerDetailsModalController', function($scope, $modalInstance, billingInvoice, customers) {
  $scope.billingInvoice = billingInvoice;
  $scope.customers = customers;
  $scope.selectedCustomer = $scope.billingInvoice.customer;

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };

  $scope.dropdownCustomerSelected = function(customer) {
    $scope.selectedCustomer = customer;
  };

  $scope.addCustomer = function() {
    console.log("Adding new Customer: " + $scope.selectedCustomer.name);
    $scope.billingInvoice.customer = $scope.selectedCustomer;
    $modalInstance.close('save');
  };
});

