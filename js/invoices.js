var app = angular.module('invoice', ['ui.bootstrap']);
app.controller('InvoiceController', ['$scope', '$http','$modal', function($scope, $http, $modal) {

    $http.get('http://localhost:8080/Templetree/rest/invoices/').success(function(data) {
      $scope.invoices = data;
    });

    $scope.open = function (i) {
      //alert("I am an alert box!");
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