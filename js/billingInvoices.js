var app = angular.module('billing', ['ui.bootstrap']);
app.controller('BillingController', ['$scope', '$http','$modal', function($scope, $http, $modal) {

  var initialize = $http.get('../resources/config.json');

    initialize.success(function(data) {
      $scope.uiProperties = data;
      $http.get($scope.uiProperties.billingInvoicelistUrl)
        .success(function(data) {
          $scope.billingInvoices = data;
        })
        .error(function(data, status, headers, config) {
          alert( "failure message: " + JSON.stringify({data: data}));
        });
    });

    $scope.open = function (i) {

      var modalInstance = $modal.open({
        templateUrl: 'billingInvoicesItemsModal.html',
        controller: 'BillingInvoicesModalController',
        resolve: {
          billingInvoicesItems: function () {
            return i.billingInvoicesItemsList;
          }
        }
      });
    };
}]);

app.controller('BillingInvoicesModalController', function ($scope, $modalInstance, billingInvoicesItems) {

    $scope.billingInvoicesItems = billingInvoicesItems;
    
    $scope.ok = function () {
      $modalInstance.dismiss('cancel');
    };
  });