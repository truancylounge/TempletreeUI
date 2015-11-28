var app = angular.module('addBilling', ['ui.bootstrap']);
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
    $scope.billingInvoice.totalAmount = $scope.billingInvoice.totalAmount + ($scope.selectedItem.purchasePrice * $scope.quantity);
    $scope.billingInvoice.billingInvoicesItemsList.push({"barcode": $scope.selectedItem.barcode, "itemName" : $scope.selectedItem.itemName, "purchasePrice" : $scope.selectedItem.purchasePrice, "quantity" : $scope.quantity, "total" : $scope.selectedItem.purchasePrice * $scope.quantity});
    $scope.quantity = 1;
    console.log("Total amount" + $scope.billingInvoice.totalAmount);
  };       

    $scope.createBillingInvoice = function() {
      console.log("Creating a new Billing Invoice");
      var res = $http.post($scope.uiProperties.billingInvoicelistUrl, $scope.billingInvoice);
      $scope.billingInvoice = {};
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
