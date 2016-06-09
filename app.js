// MODULE
var templetreeApp = angular.module('templetreeApp', ['ngRoute', 'ngResource', 'ngStorage', 'environment', 'ngAnimate', 'ui.bootstrap', 'angularjs-dropdown-multiselect', 'angularFileUpload']);

templetreeApp.controller('homeController', ['$scope', '$sessionStorage', function($scope, $sessionStorage) {
	$scope.name = 'Templetree Application Home'; 

}]);