
templetreeApp.controller('LoginController', ['$scope', '$http', '$sessionStorage', '$location', 'envService', function($scope, $http, $sessionStorage, $location, envService) {

	$scope.user = {};

  $scope.authenticate = function() {
    console.log("Authenticating user :  " + $scope.username);
    $scope.user.username = $scope.username;
    $scope.user.password = $scope.password;
    var res = $http.post(envService.read('authenticateUrl'), $scope.user);
    res.success(function(data, status, headers, config) {

      // On Success get token and store it in local session.
      if(data.authenticated) {
      	console.log("Token acquired : " + $sessionStorage.token);      
      	$sessionStorage.token = data.token;
      	$location.path('/');
      } else {
      	alert("Invalid UserName");
      }  
    });
    res.error(function(data, status, headers, config) {
      $scope.error =  data.code + ": " + data.message;
      //alert( "failure message: " + JSON.stringify({data: data}));
    });    
  };
}]);