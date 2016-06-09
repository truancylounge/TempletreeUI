templetreeApp.controller('InvoiceListController', ['$scope', '$http', '$uibModal', 'envService', function($scope, $http, $uibModal, envService) {

    $scope.sortType = 'invoiceName'; // set the default sort type
    $scope.sortReverse  = false;  // set the default sort order

    // Pagination attributes
    $scope.currentPage = envService.read('currentPage');
    $scope.itemsPerPage = envService.read('itemsPerPage');
    $scope.maxSize = envService.read('maxSize');
    
    /* Start of REST Call functions */

    $scope.successGETCallback = function(response) {
      $scope.invoices = response.data;
    };

    $scope.errorGETCallback = function(response) {
      alert( "failure message: " + JSON.stringify({data: response.data}));
    };

    $scope.retriveAllInvoices = function() {
      $http({
        method: 'GET',
        url: envService.read('invoiceUrl')
      }).then($scope.successGETCallback, $scope.errorGETCallback);      
    };
    /* End of REST Call functions */    

    $scope.open = function (i) {
      console.log(i.invoiceName);

      var modalInstance = $uibModal.open({
        templateUrl: 'invoiceItemsModal.html',
        controller: 'InvoiceModalController',
        resolve: {
          invoice: function () {
            return i;
          },
          invoiceUrl: function() {
            return envService.read('invoiceUrl');
          },
          httpService: function() {
            return $http;
          }
        }
      });
      modalInstance.result.then(function (invoice) {
        // On Modal close() event
        console.log("Invoice modal result success!");
        $scope.retriveAllInvoices();
      }, function () {
          // on Modal dismiss() event
      });
    };

    $scope.retriveAllInvoices();
}]);

templetreeApp.controller('InvoiceModalController', function ($scope, $uibModalInstance, invoice, invoiceUrl, httpService) {

    $scope.invoice = invoice;
    $scope.invoiceUrl = invoiceUrl;
    $scope.invoiceItems = invoice.invoicesItemsList;
    $scope.validity = false;

    $scope.deleteInvoice = function() {
      console.log("Deleting Invoice: " + $scope.invoice.invoiceName);
      $scope.deleteInvoice();
    };    
    
    $scope.ok = function () {
      $uibModalInstance.close('ok');
    };

    $scope.revertInvoiceItems = function() {
      console.log("Reverting InvoiceItems.");
      $scope.retriveAllInvoices();
    };    

    $scope.deleteInvoiceItem = function(i) {
      console.log("Entering deleteItem function.");
      $scope.invoiceItems = $scope.invoiceItems.filter(function(invoiceItem) {
        $scope.validity = true;
        return invoiceItem.barcode !== i.barcode;
      });
    }; 

    $scope.checkValidity = function() {
      // Validity is initally set to false. If we enter update or delete invoice items we set validity to true.
      return $scope.validity;
    };        

    /* Start of REST Call functions */     

    $scope.successDeleteCallback = function(response) {
      console.log("Success delete. Redirecting to Invoice List.")
      //$window.location.href = '../../html/invoices/invoicesList.html';
      $uibModalInstance.close('ok');
    };

    $scope.errorDeleteCallback = function(response) {
      alert( "failure message: " + JSON.stringify({data: response.data}));
    };    

    $scope.deleteInvoice = function() {
      httpService({
        method: 'DELETE',
        headers: {"Content-Type": "application/json"},
        url: $scope.invoiceUrl,
        data: $scope.invoice
      }).then($scope.successDeleteCallback, $scope.errorDeleteCallback);
    };

    $scope.successPutCallback = function(response) {
      console.log("Success PUT. Redirecting to Invoice List.")
      //$window.location.href = '../../html/invoices/invoicesList.html';
      $uibModalInstance.close('ok');
    };

    $scope.errorPutCallback = function(response) {
      alert( "failure message: " + JSON.stringify({data: response.data}));
    };  

    $scope.updateInvoice = function() {
      httpService({
        method: 'PUT',
        headers: {"Content-Type": "application/json"},
        url: $scope.invoiceUrl + "/" + $scope.invoice.id,
        data: $scope.invoice
      }).then($scope.successPutCallback, $scope.errorPutCallback);
    };

    $scope.successGETCallback = function(response) {
      $scope.invoiceItems = response.data.invoicesItemsList;
    };

    $scope.errorGETCallback = function(response) {
      alert( "failure message: " + JSON.stringify({data: response.data}));
    };

    $scope.retriveAllInvoices = function() {
      httpService({
        method: 'GET',
        url: $scope.invoiceUrl + "/" + $scope.invoice.id
      }).then($scope.successGETCallback, $scope.errorGETCallback);      
    };    
    /* End of REST Call functions */ 

});





   