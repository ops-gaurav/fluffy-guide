var mainApp = angular.module ('mainApp', ['ngRoute', 'ngResource']);

mainApp.config (['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
	$routeProvider
		.when ('/', {
			templateUrl: 'javascripts/angular/templates/login_template.html',
			controller: 'LoginController'
		})
		.when ('/signup', {
			templateUrl: 'javascripts/angular/templates//signup_template.html', 
			controller: 'SignupController'
		})
		.otherwise ('/');
	
	$locationProvider.html5Mode ({enabled: true, requireBase: false});
}]);

mainApp.controller ('LoginController', ['$scope', '$resource', '$http', function ($scope, $resource, $http) {
	$scope.loginAuth = function (){ 
		if (!$scope.username || !$scope.password) 
			$scope.auth_error =  "Username and password required";
		else {
			$http({
				method: 'POST',
				url: 'http://localhost:3000/user/auth',
				data: {username: $scope.username, password: $scope.password}
			}). then (function successCallback (data) {
				console.log ('SUCCESS: '+ JSON.stringify (data));
			}, function errorCallback (data) {
				console.log ("ERROR "+ JSON.stringify (data));
			});
		}
	}
}]);
mainApp.controller ('SignupController', ['$scope', function ($scope) {
	$scope.signup = function () {
		console.log ($scope.username + '\t'+ $scope.password + '\t' + $scope.cPassword +'\t'+ $scope.email);
	};
}]);