(function() {
	'use strict';

	angular.module('app').controller('Budget', Budget);

	function Budget($scope, $http, $rootScope, $state) {
		//this is the budget controller
		refresh();

		$scope.addItem = function() {
			$scope.projectItem.projectId = $rootScope.currentProjectId;
			console.log($scope.projectItem);
			$http.post('/projectItems', $scope.projectItem).success(function(response) {
				console.log(response);
				refresh();
			});
		};

		$scope.submit = function() {
			$state.go('home');
		}

		function refresh() {
			// $http.get('/loggedin').success(function(response) {
			// 	console.log(response);
			// 	if(response === '0') {
			// 		$rootScope.errorMessage = 'Session expired, You need to log in.';
			// 	} else {
			// 		$rootScope.currentUser = response;
			// 		$http.get('/projectItems/' + $rootScope.currentProjectId).success(function(response) {
			// 			console.log(response);
			// 			$scope.itemsList = response;
			// 		});
			// 	}
			// });
			$http.get('/projectItems/' + $rootScope.currentProjectId).success(function(response) {
				console.log(response);
				$scope.projectItems = response;
			});
		}
	}
})();