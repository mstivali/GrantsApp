(function() {
	'use strict';

	angular.module('app').controller('Project', Project);

	function Project($scope, $http, $state, $rootScope) {
		$scope.addProject = function(project) {
			$scope.project.userId = $rootScope.currentUser._id;
			console.log($scope.project);
			$http.post('/project', $scope.project).success(function(response) {
				console.log(response);
				$rootScope.currentProjectId = response._id;
				$state.go('budget');
			});
		};
	}
})();