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