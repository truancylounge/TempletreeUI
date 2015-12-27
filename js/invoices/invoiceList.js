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

var app = angular.module('invoiceList', ['ui.bootstrap', 'dependency'])
app.controller('InvoiceListController', ['$scope', '$http', '$modal', function($scope, $http, $modal) {

    var initialize = $http.get('../../resources/config.json');
    initialize.success(function(data) {
      $scope.uiProperties = data;
      $scope.sortType = 'invoiceName'; // set the default sort type
      $scope.sortReverse  = false;  // set the default sort order
      $scope.retriveAllInvoices();      
    });

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
        url: $scope.uiProperties.invoiceUrl
      }).then($scope.successGETCallback, $scope.errorGETCallback);      
    };
    /* End of REST Call functions */    

    $scope.open = function (i) {
      console.log(i.invoiceName);

      var modalInstance = $modal.open({
        templateUrl: 'invoiceItemsModal.html',
        controller: 'InvoiceModalController',
        resolve: {
          invoice: function () {
            return i;
          },
          invoiceUrl: function() {
            return $scope.uiProperties.invoiceUrl;
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
}]);

app.controller('InvoiceModalController', function ($scope, $modalInstance, invoice, invoiceUrl, httpService) {

    $scope.invoice = invoice;
    $scope.invoiceUrl = invoiceUrl;
    $scope.invoiceItems = invoice.invoicesItemsList;
    $scope.validity = false;

    $scope.deleteInvoice = function() {
      console.log("Deleting Invoice: " + $scope.invoice.invoiceName);
      $scope.deleteInvoice();
    };    
    
    $scope.ok = function () {
      $modalInstance.close('ok');
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
      $modalInstance.close('ok');
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
      $modalInstance.close('ok');
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





   