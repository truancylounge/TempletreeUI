var app = angular.module('addBilling', ['ui.bootstrap']);
app.controller('AddBillingController', ['$scope', '$http','$modal', function($scope, $http, $modal) {

  var initialize = $http.get('../resources/config.json');

    initialize.success(function(data) {
      console.log("Entering Intialize");
      $scope.uiProperties = data;
      $scope.billingInvoicesItemsList = [];
      $scope.billingInvoice = {};
      $scope.billingInvoice.billingInvoicesItemsList = $scope.billingInvoicesItemsList;
      $scope.billingInvoice.totalAmount;

      $http.get($scope.uiProperties.itemlistUrl)
        .success(function(data) {
          $scope.items = data;
        })
        .error(function(data, status, headers, config) {
          alert( "failure message: " + JSON.stringify({data: data}));
        });
    });

    $scope.createBillingInvoice = function() {
      console.log("Creating a new Billing Invoice");
      var res = $http.post($scope.uiProperties.billingInvoicelistUrl, $scope.billingInvoice);
      $scope.billingInvoice = {};
    };

    $scope.addNewItemOpen = function () {
      console.log("Entering AddBillingInvoice - Add Items modal.");

      var modalInstance = $modal.open({
        templateUrl: 'addItemsBillingInvoicesModal.html',
        controller: 'AddItemsBillingInvoicesModalController',
        resolve: {
          billingInvoicesItemsList: function () {
            return $scope.billingInvoicesItemsList;
          },
          items: function() {
            return $scope.items;
          },
          totalAmount: function() {
            return $scope.billingInvoice.totalAmount;
          }
        }
      });

      modalInstance.result.then(function (totalAmount) {
        $scope.billingInvoice.totalAmount = totalAmount;
      }, function (totalAmount) {
        console.log('Modal dismissed at: ' + new Date());
      });      
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

}]);

app.controller('AddItemsBillingInvoicesModalController', function($scope, $modalInstance, billingInvoicesItemsList, items, totalAmount) {
  $scope.billingInvoicesItemsList = billingInvoicesItemsList;
  $scope.items = items;
  $scope.totalAmount = totalAmount || 0;

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };

  $scope.dropdownItemSelected = function(item) {
    $scope.selectedItem = item;
  };

  $scope.addItems = function() {
    console.log("Adding new Item: " + $scope.selectedItem.itemName);
    $scope.totalAmount = $scope.totalAmount + ($scope.selectedItem.purchasePrice * $scope.quantity);
    console.log("TotalAmount: " + $scope.totalAmount);
    
    $scope.billingInvoicesItemsList.push({"barcode": $scope.selectedItem.barcode, "itemName" : $scope.selectedItem.itemName, "purchasePrice" : $scope.selectedItem.purchasePrice, "quantity" : $scope.quantity, "total" : $scope.selectedItem.purchasePrice * $scope.quantity});
    $modalInstance.close($scope.totalAmount);
  };
});

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

