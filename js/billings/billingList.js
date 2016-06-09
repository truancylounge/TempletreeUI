templetreeApp.controller('BillingListController', ['$scope', '$http', '$uibModal', 'envService',  function($scope, $http, $uibModal, envService) {

    $scope.billingInvoices = [];
    
    $scope.sortType = 'invoiceName'; // set the default sort type
    $scope.sortReverse  = false;  // set the default sort order
    
    /* Start of REST Call functions */

    $scope.successGETCallback = function(response) {
      $scope.billingInvoices = response.data;
    };

    $scope.errorGETCallback = function(response) {
      alert( "failure message: " + JSON.stringify({data: response.data}));
    };    

    $scope.retrieveBillingInvoices = function() {
      $http({
        method: 'GET',
        url: envService.read('billingInvoicelistUrl')
      }).then($scope.successGETCallback, $scope.errorGETCallback); 
    };

    /* End of REST Call functions */       

    $scope.open = function (i) {
      var modalInstance = $uibModal.open({
        templateUrl: 'billingInvoicesItemsModal.html',
        controller: 'BillingInvoicesModalController',
        resolve: {
          billingInvoicesItems: function () {
            return i.billingInvoicesItemsList;
          }
        }
      });
    };

    $scope.retrieveBillingInvoices();
}]);

templetreeApp.controller('BillingInvoicesModalController', function ($scope, $uibModalInstance, billingInvoicesItems) {

    $scope.billingInvoicesItems = billingInvoicesItems;
    
    $scope.ok = function () {
      $uibModalInstance.dismiss('cancel');
    };
});







   