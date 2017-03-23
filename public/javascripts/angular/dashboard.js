var app = angular.module ('dashboardApp', ['ngResource', 'ui.router', 'ngFileUpload']);

app.config (['$stateProvider', '$urlRouterProvider', '$locationProvider', function ($stateProvider, $urlRouterProvider, $locationProvider) {
	$stateProvider
		.state('loggedIn', {
			url: '/dBoard',
			templateUrl: '/javascripts/angular/templates/def-dashboard.html',
			controller: 'DashboardController'
		})
		.state ('uInfo', {
			url: '/updateInfo',
			templateUrl: '/javascripts/angular/templates/update-info.html',
			controller: 'UpdateController'
		})
		.state ('uPass', {
			url: '/updatePass',
			templateUrl: '/javascripts/angular/templates/update-password.html',
			controller: 'UpdateController'
		});
	
	$urlRouterProvider.otherwise ('/dBoard');
	$locationProvider.html5Mode ({
		enabled: true,
		requireBase: false
	});
}]);

app.controller ('DashboardController', ['$scope', '$rootScope', '$http', '$window', 'Upload', 'userinfo', function ($scope, $rootScope, $http, $window, Upload, userinfo) {
	userinfo.session().info ((data) => {
		if (data.status == 'success') {
			$rootScope.username = data.data.username;
			$rootScope.email = data.data.email;

			console.log ("SESSION: "+ data.data.username +'\t'+ data.data.email);
		}
	});

	$scope.logout = function () {
		userinfo.logout().process ((data) => {
			$window.location = '/';
		});
	};

	// ********** FIXED :) ***********	
	// ------> :) CANNOT UPLOAD PIC MORE THAN ONCE WITHOUT RELOADING PAGE :) <-----
	// CHECK
	$scope.fileUpload= function (file, errFiles) {
		if (file) {
			$scope.file = file;
			var url= '/user/image';
			Upload.upload ({
				url: url,
				method: 'PUT',
				data: {avatar: file}
			}). then (function (resp){ // success
				// https://github.com/danialfarid/ng-file-upload
				var response = resp.data;
				if (response.status == 'success') {
					console.log ('uploaded');
					$('#user-img').attr ('src', '/user/image');
				} else {
					console.log ('some error '+ response.message);
				}
				
			}, function (res) {
				//catch error
				console.log ('Error: '+ resp);
			}, function (event) {

			});
		}
	};
}]);

app.controller ('UpdateController', ['$scope', '$rootScope', '$window', '$http', 'userinfo', function ($scope, $rootScope, $window, $http, userinfo){
	$scope.updateInfo = function () {
		if (!$scope.newUsername || $scope.newUsername == '' || $scope.newUsername.trim() == '')
			$scope.newUsername = $rootScope.username;
		if (!$scope.newEmail || $scope.newEmail == '' || $scope.newEmail.trim() == '')
			$scope.newEmail = $rootScope.email;
		userinfo.updateInformation().change ({username: $scope.newUsername, email: $scope.newEmail}, (data) => {
			if (data.status == 'success') {
				$scope.auth_error = undefined;
				$rootScope.username = data.username;
				$rootScope.email = data.email;

				$scope.auth_error = "Updated.";
				setTimeout (function (){
					$window.location = '/dashboard';
				}, 2000);
			} else {
				if (data.message == 'Login first')
					$window.location = '/';
				else
					$scope.auth_error = data.message;
			}
		});
	}

	$scope.updatePassword = function () {
		var valid = authenticatePass();
		if (valid) {
			$scope.auth_error = 'Password authenticated';
			userinfo.updatePassword().change ({oldPass: $scope.oldPassword, newPass: $scope.newPassword}, (data) => {
				if (data.status == 'success') {
					$scope.auth_error = undefined;
					$scope.auth_error = "Password updated";

					setTimeout (function () {
						$window.location = '/';
					}, 2000);
				} else {
					$scope.auth_error = data.message;
				}
			});
		} else {
			$scope.auth_error = "Required all fields and confirmation password must match with the new one";
		}
	}

	function authenticatePass () {
		if (!$scope.oldPassword || $scope.oldPassword == '' || $scope.oldPassword.trim() == '' ||
			!$scope.newPassword || $scope.newPassword == '' || $scope.newPassword.trim() == '' ||
			!$scope.cNewPassword || $scope.cNewPassword == '' || $scope.cNewPassword.trim() == '') {
			return false;
		} else if ($scope.newPassword != $scope.cNewPassword)
			return false;
		else
			return true;
	}
}]);

app.service ('userinfo', ['$resource', function ($resource) {
	this.session = function() {
		return $resource ('/user/sessioninfo', {}, {
			info: {method: 'GET'}
		});
	};
	this.logout = function () {
		return $resource ('/user/logout', {}, {
			process: {method: 'GET'}
		})
	}
	this.updateProfile= function (formData) {
		return $resource ('/user/image', {image: "@image"}, {
			upload: {method: 'PUT'}
		});
	}

	this.updateInformation = function () {
		return $resource('/user/updateInfo', {username: '@username', email: '@email'}, {
			change: {method: 'PUT'}
		})
	}

	this.updatePassword = function () {
		return $resource ('/user/updatePassword', {newPassword: '@newPassword', oldPassword: '@oldPassword'}, {
			change: {method: 'PUT'}
		})
	}
}]);