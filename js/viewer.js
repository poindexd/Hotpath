var dd = angular.module('dd', ['ngAnimate', 'ngSanitize', 'firebase']);

dd.controller('controller', ['$scope', '$filter', '$timeout', '$sce', '$location', '$firebaseObject', '$firebaseArray',
 function($scope, $filter, $timeout, $sce, $location, $firebaseObject, $firebaseArray) {

	//Initialize slides and render slides[0]
	$scope.init = function(){
		var surveyKey = $scope.surveyKey = $location.search()['survey'];
		console.log(surveyKey);

		var surveyRef = firebase.database().ref().child('surveys/' + surveyKey);
		var slidesRef = firebase.database().ref().child('slides/').orderByChild('surveyKey').equalTo(surveyKey);

		$scope.survey = $firebaseObject(surveyRef);
		$scope.survey.$bindTo($scope, 'survey');

		$scope.slides = $firebaseArray(slidesRef);
		$scope.slides.$loaded()
		.then(function(x){
			$scope.showSlide(0);
			$scope.loaded = true;
		});
	};
	$scope.init();

	//Render a slide, play audio, and set duration if applicable
	$scope.showSlide = function(index){
		
		$scope.index = index;

		if (index >= $scope.slides.length)
			return;

		$scope.slide = $scope.slides[index];
		$scope.progress = (($scope.index / ($scope.slides.length -1)) * 100) + '%';

		if ($scope.slide.audio){
			$scope.busy = true;
			var audio = new Audio('http://sb.webhook.org' + $scope.slide.audio.url);
			audio.onended = function(){
				$scope.$apply(function(){
					$scope.busy = false;
					$scope.advanceSlide();
				});
			}
			audio.play();
		}

		if ($scope.slide.duration){
			$scope.busy = true;
			$timeout(function(){
				$scope.busy = false;
				$scope.advanceSlide();
			}, $scope.slide.duration*1000);
		}
	}

	//Check if the current slide is likert, if not implies multi choice
	$scope.isLikert = function(){
		if (!$scope.slide.options || $scope.slide.options.length < 5)
			return false;

		var ret = true;
		angular.forEach($scope.slide.options, function(option){
			if (option.correct == true)
				ret = false;
		});
		return ret;
	}

	//Show the next slide
	$scope.advanceSlide = function(){
		if(!$scope.busy)
			$scope.showSlide(++$scope.index);
	}

	$scope.trustAsHtml = function(snippet){
		return $sce.trustAsHtml(snippet)
	}

}]);