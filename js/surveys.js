var dd = angular.module('dd', ['ngAnimate', 'ngSanitize']);

dd.controller('controller', ['$scope', '$filter', '$timeout', '$sce',
 function($scope, $filter, $timeout, $sce) {

 	$scope.surveys = [
 		{
 			name: 'Hotpath Demo Survey',
 			organization: 'Wellopp',
 			image: 'http://www.ichom.org/wp-content/uploads/2015/03/bp_level_of_pain_01_455x620-420x315.jpg'
 		},
 		{
 			name: 'Pregnancy and Childbirth',
 			organization: 'IHCOM',
 			image: 'http://www.ichom.org/wp-content/uploads/2015/03/pcb-420x315.jpg'
 		}
 	];

}]);


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