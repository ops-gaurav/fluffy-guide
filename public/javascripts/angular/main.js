var mainApp = angular.module ('mainApp', ['ngRoute']);

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

mainApp.controller ('LoginController', ['$scope', function ($scope) {
	$scope.loginAuth = function (){ 
		if (!$scope.username || !$scope.password)
			$scope.auth_error =  "Username and password required";
		console.log ($scope.username+ '\t'+ $scope.password);
	}
}]);
mainApp.controller ('SignupController', ['$scope', function ($scope) {
	$scope.signup = function () {
		console.log ($scope.username + '\t'+ $scope.password + '\t' + $scope.cPassword +'\t'+ $scope.email);
	};
}]);