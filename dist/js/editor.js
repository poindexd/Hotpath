var editor = angular.module('dd', ['as.sortable', 'flow', 'angular-content-editable', 'firebase']);

editor.controller('controller', ['$scope', '$filter', '$timeout', '$sce', '$location', '$firebaseObject', '$firebaseArray',
 function($scope, $filter, $timeout, $sce, $location, $firebaseObject, $firebaseArray) {

	//Initialize slides and render slides[0]
	$scope.init = function(){

		//if (!firebase.auth().currentUser)
			//window.location = encodeURI('/login.html?redirect=' + window.location.href);

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
			$scope.$watch('slide', function(new_val, old_val, scope){
				$scope.slides.$save(scope.index);
			}, true);
			$scope.loaded = true;
		});
		
	};
	$scope.init();

	//Render a slide, play audio, and set duration if applicable
	$scope.showSlide = function(index){

			$scope.index = index;

			if (index < 0 || index >= $scope.slides.length)
				return;

			$scope.slide = $scope.slides[index];
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

	$scope.newSlide = function(){
		$scope.slides.$add({
			surveyKey: $scope.surveyKey
		})
		.then(function(ref){
			var index = $scope.slides.$indexFor(ref.key);
			$scope.showSlide(index);
			Materialize.toast('Slide Added', 2000);
		});
	}
	$scope.deleteSlide = function(){
		delete $scope.slide;
		$scope.slides.$remove($scope.index)
		.then(function(ref){
			$scope.showSlide(Math.max($scope.index, $scope.slides.length-2));
		});
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

		var file = $flow.files[$flow.files.length - 1].file;

		var metadata = {
		  contentType: 'image/jpeg'
		};

		var uploadTask = firebase.storage().ref().child('slideImage/' + $scope.slide.$id).put(file, metadata);

		// Listen for state changes, errors, and completion of the upload.
		uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
			function(snapshot) {
				// Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
				var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				console.log('Upload is ' + progress + '% done');
				switch (snapshot.state) {
					case firebase.storage.TaskState.PAUSED: // or 'paused'
						console.log('Upload is paused');
						break;
					case firebase.storage.TaskState.RUNNING: // or 'running'
						if (progress < 100)
							Materialize.toast('Uploading', 2000);
						else
							Materialize.toast('Complete', 2000);
						break;
				}
			}, function(error) {
			switch (error.code) {
				case 'storage/unknown':
					Materialize.toast('An Error Occurred', 2000);
					break;
			}
		}, function() {
			$scope.slide.image_url = uploadTask.snapshot.downloadURL;
			$scope.$apply();
		});


	});

	$scope.dragControlListeners = {
		containment: '#slide-nav'
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

	$scope.deleteImage = function(){
		$('.overlay').css('opacity', 0);
		var imageRef = firebase.storage().ref().child('slideImage/' + $scope.slide.$id);
		imageRef.delete()
		$scope.slide.image_url=null;
		$scope.slide.image_align=null;
		Materialize.toast('Image Deleted', 2000);
	}
	$scope.imagePlaceholderClick = function(e){
		e.preventDefault();
		if (!$scope.slide.image_url)
			$('input[type=file]').click();
	}

	$scope.preview = function(){
		$('#preview iframe').attr('src', '/viewer.html#?survey=' + $scope.survey.$id);
		$('#preview').openModal();
	}


}]);