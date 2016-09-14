var surveys = angular.module('surveys', ['firebase']);

surveys.controller('controller', ['$scope', '$filter', '$timeout', '$sce', '$firebaseArray',
 function($scope, $filter, $timeout, $sce, $firebaseArray) {

 	$scope.init = function(){
 		var surveysRef = firebase.database().ref().child('surveys/');
 		$scope.surveys = $firebaseArray(surveysRef);
 		$scope.surveys.$loaded()
 		.then(function(x){
 			$scope.loaded = true;
 		})
 	}

 	$scope.init();

 	$scope.newSurvey = function() {
 		var key = firebase.database().ref().child('surveys').push().key;
 		window.location = 'editor.html#?survey=' + key;
 	}

}]);