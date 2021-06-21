'use strict';


var app = angular.module('myApp.view6', ['ngRoute']);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view6', {
    templateUrl: 'view6/view6.html',
    controller: 'View6Ctrl'
  });
}])

.controller('View6Ctrl', function($scope, $http, $interval, cssInjector) {
    //$http.defaults.headers.common["api-key"] = "80e4d9935ef1778c43ecd7801bd4ae4c";
    $scope.loading = true;
	cssInjector.add("view6/view6.css");
    $scope.selectedTopic = "show all";
    $scope.bookData = {};
	$scope.memoryverseindex = 0;
    $scope.kjv = "";
    $http.get("https://20.70.176.210/php/bible/select.php")
       .then(function(response) {
         $scope.kjv = response.data;
         $scope.bookData = $scope.kjv;
         $scope.loading = false;
		 console.log($scope.bookData);
       }, function(response) {
               $scope.kjv = response.data || 'Request failed';
    });
    
   
      $scope.setMemoryVerseIndex = function(index){
        $scope.memoryverseindex = index;
  
    };  
    
}); 
