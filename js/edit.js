var dd = angular.module('dd', ['as.sortable', 'flow', 'angular-content-editable']);

dd.controller('controller', ['$scope', '$filter', '$timeout', '$sce',
 function($scope, $filter, $timeout, $sce) {

	//Helper function that grabs data from Firebase and updates scope
	$scope.grab = function(what, callback){
		$scope.ref.child(what).on('value', function(snapshot) {
			$scope[what] = [];
			$scope.$apply(function () {
				angular.forEach(snapshot.val(), function(value, key){
					$scope[what].push(value);
				});
				console.log($scope[what]);
				if (callback)
					callback($scope[what]);
			});
		});
	}

	//Initialize slides and render slides[0]
	$scope.init = function(){
		$scope.grab('slides',function(slides){
			//$scope.index = 0;
			$scope.showSlide($scope.index = 0);
		});
		$scope.grab('surveys');
	};

	//Render a slide, play audio, and set duration if applicable
	$scope.showSlide = function(index){

		//$scope.$apply(function(){
			$scope.index = index;
			
			if (index < 0 || index >= $scope.slides.length)
				return;

			/*$('#card').velocity(
				{ opacity: "0", translateX: "-50%"},
				{ duration: 800, delay: 0, easing: [60, 10] });
*/

				$scope.slide = $scope.slides[index];

/*
			$('#card').velocity(
				{translateX: "50%"},
				{duration: 0}
				);
				$('#card').velocity(
				{ opacity: "1", translateX: "0px"},
				{ duration: 800, delay: 0, easing: [60, 10] });
*/

		//});

	}

	//Check if the current slide is likert, if not implies multi choice
	$scope.isLikert = function(){
		if (!$scope.slide || !$scope.slide.options || $scope.slide.options.length == 0)
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

	$scope.$on('flow::filesSubmitted', function (event, $flow, flowFile) {
		event.preventDefault();//prevent file from uploading

/*
		if (!$scope.slide.image)
			$scope.slide.image = {};

		$scope.slide.image.resize_url = $flow.files[0].file;
	*/	
		var reader = new FileReader();

		reader.onload = function(e) {
			if (!$scope.slide.image)
				$scope.slide.image = {};
			$scope.slide.image.resize_url = e.target.result;
		};

		reader.readAsDataURL($flow.files[$flow.files.length - 1].file);
		
	});

	$scope.ref = new Firebase('https://webhook.firebaseio.com/buckets/sb/e9a4ff1d-eb5e-4fbd-8950-ceceab335e94/dev/data');
	$scope.init();


	$scope.dragControlListeners = {
		//accept: function (sourceItemHandleScope, destSortableScope) {return true},//override to determine drag is allowed or not. default is true.
		//itemMoved: function (event) {},
		//orderChanged: function(event) {},
		containment: '#slide-nav',//optional param.
		//clone: true, //optional param for clone feature.
		//allowDuplicates: true //optional param allows duplicates to be dropped.
	};

	$scope.icons = ['face', 'favorite_border', 'event', 'done', 
									'grade', 'info_outline', 'help_outline', 'highlight_off',
									'schedule', 'search', 'settings', 'error_outline',
									'music_note', 'timeline', 'restaurant', 'chat_bubble_outline',
									'visibility', 'room', 'question_answer', 'shopping_cart',
									'trending_down', 'trending_flat', 'trending_up', 'update',
									'verified_user', 'work', 'equalizer', 'play_circle_outline',
									'call', 'business', 'import_contacts', 'speaker_phone',
									'vpn_key', 'mail', 'flag', 'weekend', 'attach_money',
									'cloud_queue', 'headset', 'keyboard', 'keyboard_voice', 'color_lens',
									'edit', 'healing', 'nature_people'];

	$scope.selectIcon = function(icon){
		$scope.slide.icon = icon;
		$("#icon-selector").closeModal()
	}

	$scope.removeImage = function(){
		$('.overlay').css('opacity', 0);
		$scope.slide.image.resize_url="";
		$scope.slide.image_align="";

	}
	$scope.imagePlaceholderClick = function(e){
		e.preventDefault();
		if (!$scope.slide.image.resize_url)
			$('input').eq(0).click();
	}
}]);

/*
dd.directive('backImg', function(){
		return function(scope, element, attrs){
				attrs.$observe('backImg', function(value) {
						element.css({
								'background-image': 'url(' + value +')',
								'background-size' : 'cover'
						});
				});
		};
});
*/
/*
dd.directive("contenteditable", function() {
	return {
		require: "ngModel",
		link: function(scope, element, attrs, ngModel) {

			function read() {
				ngModel.$setViewValue(element.html());
			}

			ngModel.$render = function() {
				element.html(ngModel.$viewValue || "");
			};

			element.bind("blur keyup change", function() {
				scope.$apply(read);
			});
		}
	};
});
*/
function unique(value, index, self) { 
	if (value) return self.indexOf(value) === index;
}

function combine(pre, cur) {
	return pre.concat(cur);
}

function p(name){
	return (function(name, obj){
		if (obj)
			return obj[name];
	}).bind(null, name);
}