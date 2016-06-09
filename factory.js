templetreeApp.factory('tokenHttpInterceptor', ['$q', '$location', '$sessionStorage', function($q, $location, $sessionStorage) {
  var errorJson;
  return {
    'response': function (response) {
      console.log('Response Interceptor: New Token: ' + response.headers('X-Templteree-Auth-Token') );
      $sessionStorage.token = response.headers('X-Templteree-Auth-Token') || $sessionStorage.token;
      return response;
    },
    'request': function (config) {
      console.log('Request Interceptor: Adding token : ' + $sessionStorage.token);

      config.headers.Authorization = $sessionStorage.token;
      if($sessionStorage.token === undefined) {
        console.log("Undefined token, redirecting to login");
        $location.path('/login');;
      }
      return config;
    },
    'responseError': function(response) {

        console.log("Error Response Interceptor");

        if(response.status === 403) {
            console.log("Redirecting to login page! Invalid Token.");
            $location.path('/login');
        }

        return response;  
      }
    }
}]);