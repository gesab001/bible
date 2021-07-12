'use strict';


var app = angular.module('myApp.view7', ['ngRoute']);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view7', {
    templateUrl: 'view7/view7.html',
    controller: 'View7Ctrl'
  });
}])

.controller('View7Ctrl', function($scope, $routeParams, $http, $interval, cssInjector) {
    //$http.defaults.headers.common["api-key"] = "80e4d9935ef1778c43ecd7801bd4ae4c";
	//https://20.70.176.210/php/bible/select.php
	//https://20.70.176.210/php/bible/select.php
	$scope.ip = "192.168.1.69";
    $scope.loading = true;
	cssInjector.add("view7/view7.css");
    $scope.selectedTopic = "show all";
    $scope.bookParam = $routeParams.book;
    $scope.chapterParam = $routeParams.chapter;
    $scope.verseParam = $routeParams.verse;
    $scope.wordParam = $routeParams.word;
    $scope.typingText = $scope.wordParam +  " (" + $scope.bookParam + " " + $scope.chapterParam + ":" + $scope.verseParam + ")";
    $scope.characterList = $scope.typingText.split("");
    $scope.characterListIndex = 0;
    $scope.targetKey = $scope.characterList[$scope.characterListIndex];
    $scope.mistakesCount = 0;
    $scope.totalKeys = $scope.characterList.length;
    $scope.totalKeyStroke = 0;
    $scope.totalWordsEntered = 0;
    $scope.totalWordErrors = 0;
    $scope.netSpeed = 0;
    $scope.accuracy = 100;
    $scope.timeSpent = 0;

    console.log($scope.targetKey);
    
    $scope.checkKeyPress = function(keyEvent) {
          console.log(keyEvent.key);
          if (keyEvent.key === "backspace"){
            console.log("backspace");
          }
	  if (keyEvent.key === $scope.targetKey){
	  
	    console.log('correct');
	    var correctKey = document.getElementById($scope.characterListIndex);
	    correctKey.style.color = "black";
	    console.log("correctKey " + correctKey);
	    $scope.totalKeyStroke = $scope.totalKeyStroke + 1;
	    $scope.totalWordsEntered =  $scope.totalKeyStroke / 5;
	    $scope.characterListIndex = $scope.characterListIndex + 1;

	    $scope.targetKey = $scope.characterList[$scope.characterListIndex];
	    console.log("target key: " + $scope.targetKey);
	    if ($scope.targetKey === undefined){
	       $scope.stopTimer();
	       alert("good job");
	    }
	    

	

	  }
	  else{
	    var wrongKey = document.getElementById($scope.characterListIndex);
	    wrongKey.style.color = "red";
	    wrongKey.style.textDecoration = "line-through";
	    $scope.characterListIndex = $scope.characterListIndex + 1;
	    $scope.targetKey = $scope.characterList[$scope.characterListIndex];
	    $scope.mistakesCount = $scope.mistakesCount + 1;
	    $scope.totalKeyStroke = $scope.totalKeyStroke + 1;
	    $scope.totalWordsEntered =  $scope.totalKeyStroke / 5;
	    $scope.totalWordErrors = $scope.mistakesCount / 5;
	    
	    console.log("wrong");
	  } 
	};
	
    $scope.deleteCharacter = function(keyEvent) {
          //console.log(keyEvent.key);
          if (keyEvent.key === "Backspace"){
            console.log("backspace");
            $scope.characterListIndex = $scope.characterListIndex - 1;
            var correctKey = document.getElementById($scope.characterListIndex);
	    correctKey.style.color = "grey";
	    correctKey.style.textDecoration = "none";
	    console.log("correctKey " + correctKey);
	    $scope.targetKey = $scope.characterList[$scope.characterListIndex];
          }
	};

    $scope.timer;
    
    $scope.startTest = function(){
            document.getElementById("typingText").focus();
            $scope.characterListIndex = 0;
	    $scope.targetKey = $scope.characterList[$scope.characterListIndex];
	    $scope.mistakesCount = 0;
	    $scope.totalKeys = $scope.characterList.length;
	    $scope.totalKeyStroke = 0;
	    $scope.totalWordsEntered = 0;
	    $scope.totalWordErrors = 0;
	    $scope.netSpeed = 0;
	    $scope.accuracy = 100;
	    $scope.timeSpent = 0;
	    for (var i=0; i<$scope.totalKeys; i++){
	      var correctKey = document.getElementById(i);
	      correctKey.style.color = "grey";
	      correctKey.style.textDecoration = "none";
	    }
	$scope.timer = $interval(function () {
		$scope.timeSpent = $scope.timeSpent + 1;
		$scope.timeLapse = $scope.timeSpent / 60;
		$scope.netSpeed = Math.round(($scope.totalWordsEntered - $scope.totalWordErrors) / $scope.timeLapse);
		$scope.accuracy = Math.round(($scope.totalWordsEntered - $scope.totalWordErrors) / $scope.totalWordsEntered * 100);
		
	    }, 1000);
    };
    
    $scope.stopTimer = function() {
       $interval.cancel($scope.timer); 
    };
    
    $scope.formatTimer = function(){
       if ($scope.timeSpent<59){
        return $scope.timeSpent + " seconds";
       }else{
         var minutes = 1;
         var seconds = $scope.timeSpent - 60;
         while (seconds > 60){
           minutes = minutes + 1;
           seconds = seconds - 60;
         }
         return minutes + " minutes and " + seconds + " seconds" ;
       }
    }
    
}); 

