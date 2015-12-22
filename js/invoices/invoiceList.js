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





   