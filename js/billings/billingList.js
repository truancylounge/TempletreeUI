var dependentApp = angular.module('dependency',[]);
dependentApp.factory('tokenHttpInterceptor', ['$q', '$window', '$location', function ($q, $window, $location) {
        return {
            'request': function (config) {
              console.log('Request BillingList Interceptor: Adding token : ' + $window.sessionStorage.token);
              config.headers.Authorization = $window.sessionStorage.token;
              return config;
            },

            'response': function (response) {              
              console.log('Response BillingList Interceptor: New Token: ' + response.headers('X-Templteree-Auth-Token') );
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

var app = angular.module('billingList', ['ui.bootstrap', 'dependency'])
app.controller('BillingListController', ['$scope', '$http', '$modal', function($scope, $http, $modal) {

    var initialize = $http.get('../../resources/config.json');

    initialize.success(function(data) {
      console.log("Initialize GET call.");
      $scope.uiProperties = data;
      $scope.retrieveBillingInvoices();
    });

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
        url: $scope.uiProperties.billingInvoicelistUrl
      }).then($scope.successGETCallback, $scope.errorGETCallback); 
    };

    /* End of REST Call functions */       

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







   