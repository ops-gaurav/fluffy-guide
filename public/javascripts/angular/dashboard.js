var app = angular.module ('dashboardApp', ['ngResource', 'ngFileUpload']);

app.controller ('DashboardController', ['$scope', '$http', '$window', 'Upload', 'userinfo', function ($scope, $http, $window, Upload, userinfo) {
	userinfo.session().info ((data) => {
		if (data.status == 'success') {
			$scope.username = data.data.username;
			$scope.email = data.data.email;
		}
	});

	$scope.logout = function () {
		userinfo.logout().process ((data) => {
			$window.location = '/';
		});
	};

	$scope.fileUpload= function (file, errFiles) {
		$scope.file = file;
		var formData = new FormData();
		formData.append ('file', file);

		$http({
			method: 'PUT',
			url: '/user/image',
			data: '',
			headers: {
				"Content-Type": 'multipart/form-data'
			}
		}).then (function success(data) {
			console.log (data);
		}, function error(data) {
			console.log (data);
		});

	};
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
}]);