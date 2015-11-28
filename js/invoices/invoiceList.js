var app = angular.module('invoiceList', ['ui.bootstrap'])
app.controller('InvoiceListController', ['$scope', '$http', '$modal', function($scope, $http, $modal) {

    var initialize = $http.get('../../resources/config.json');
    initialize.success(function(data) {
      $scope.uiProperties = data;
      $http.get($scope.uiProperties.invoiceUrl)
        .success(function(data) {
          $scope.invoices = data;
        })
        .error(function(data, status, headers, config) {
          alert( "failure message: " + JSON.stringify({data: data}));
        });
    });

    $scope.open = function (i) {
      console.log(i.invoiceName);

      var modalInstance = $modal.open({
        templateUrl: 'invoiceItemsModal.html',
        controller: 'InvoiceModalController',
        resolve: {
          invoiceItems: function () {
            return i.invoicesItemsList;
          }
        }
      });
    };
}]);

app.controller('InvoiceModalController', function ($scope, $modalInstance, invoiceItems) {

    $scope.invoiceItems = invoiceItems;
    
    $scope.ok = function () {
      $modalInstance.dismiss('cancel');
    };
});





   