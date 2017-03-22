var mainApp = angular.module ('mainApp', ['ngResource', 'ui.router']);

mainApp.config (['$stateProvider', '$urlRouterProvider', '$locationProvider', function ($stateProvider, $urlRouterProvider, $locationProvider) {
	$stateProvider
		.state ('default', {
			url: '/',
			templateUrl: 'javascripts/angular/templates/login_template.html',
			controller: 'LoginController'
		})
		.state ('signup', {
			url: '/signup',
			templateUrl: 'javascripts/angular/templates//signup_template.html',
			controller: 'SignupController'
		});
	
	$urlRouterProvider.otherwise ('/');
	$locationProvider.html5Mode ({
		enabled: true,
		requireBase: false
	});
}]);
mainApp.controller ('LoginController', ['$scope', '$window', 'LoginConnect', function ($scope, $window, LoginConnect) {
	$scope.loginAuth = function (){ 
		if (!$scope.username || !$scope.password) 
			$scope.auth_error =  "Username and password required";
		else {
			LoginConnect.authenticate ({username: $scope.username, password: $scope.password}, (data) => {
				if (data.status == 'success')
					$window.location = '/dashboard';
				else
					$scope.auth_error = 'Username or password error'
			});
		}
	}
}]);
mainApp.controller ('SignupController', ['$scope', '$window', 'SignupService', function ($scope, $location, $window, SignupService) {
	$scope.signup = function () {
		if ($scope.username && $scope.email && $scope.password  && $scope.cPassword) {

			if ($scope.password == $scope.cPassword) {
				$scope.auth_error = undefined;
				
				SignupService.register ({
					username: $scope.username,
					email: $scope.email,
					password: $scope.password,
					cPassword: $scope.password
				}, (data) => {
					if (data.status == 'success') {
						$window.location = '/';
					} else {
						$scope.auth_error = data.message;
					}
				});
			} else
				$scope.auth_error = 'password did not match';
		} else {
			$scope.auth_error = 'Required all fields';
		}
	};
}]);

mainApp.factory ('LoginConnect', ['$resource', function ($resource){
	return $resource ('/user/auth', {username: '@username', password: '@password'}, {
		authenticate: {method: 'POST'}
	});
}]);

mainApp.factory ('SignupService', ['$resource', function ($resource) {
	return $resource  ('/user/signup', {username: '@username', password: '@password', cPassword: '@cPassword', email: '@email'}, {
		register: {method: 'POST'}
	});
}]);