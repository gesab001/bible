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
	//https://20.70.176.210/php/bible/select.php
	//https://20.70.176.210/php/bible/select.php
	$scope.ip = "192.168.1.69";
    $scope.loading = true;
	cssInjector.add("view6/view6.css");
    $scope.selectedTopic = "show all";
    $scope.bookData = null;
	$scope.book = "";
	$scope.chapter = "";
	$scope.verse = "";
	$scope.word = "";
	$scope.memoryverseindex = 0;
    $scope.kjv = "";
 /*   $http.get("https://192.168.1.69/php/bible/select.php")
       .then(function(response) {
         $scope.kjv = response.data;
         $scope.bookData = $scope.kjv;
         $scope.loading = false;
		 console.log(JSON.stringify($scope.bookData));
       }, function(response) {
               $scope.kjv = response.data || 'Request failed';
    });*/
    
       
      $scope.setMemoryVerseIndex = function(index){
        $scope.memoryverseindex = index;
  
    };  
	
	   $scope.addVerse = function(){
		  var verseObj = {"book": $scope.book, "chapter": $scope.chapter, "verse": $scope.verse, "word": $scope.word}; 
		  $scope.bookData.push(verseObj);
       updateMemoryVerse($scope.bookData);
  
    };  
	
	$scope.deleteThis = function(index){
		console.log(index);
		$scope.bookData.splice(index, 1);
		console.log($scope.bookData);
		updateMemoryVerse($scope.bookData);
	}
	
		$scope.getMemoryVersesFromDropbox = function(){
			var dropboxtoken = "zfsxgjXKLgoAAAAAAAAAARNIvbSToineCXgZ6zH0w3QkQY4V5J8pbYtHmxfRunhQ";
            var path = "memoryverses.json";
			var req = {
						 method: 'POST',
						 url: 'https://content.dropboxapi.com/2/files/download',
						 headers: {
						   "Authorization": "Bearer " + dropboxtoken,
						   "Dropbox-API-Arg": "{\"path\": \"/"+path+"\"}"
						 }
					  }
			$http(req)
			   .then(function(response) {
				 $scope.kjv = response.data;
				 $scope.bookData = $scope.kjv;
				 $scope.loading = false;
				 console.log(JSON.stringify($scope.bookData));
			   }, function(response) {
					   $scope.kjv = response.data || 'Request failed';
			});
  
    };  
	
	$scope.getMemoryVersesFromDropbox();
    
}); 


function updateMemoryVerse(jsondata){
   console.log("add verse");
   var dropboxtoken = "zfsxgjXKLgoAAAAAAAAAARNIvbSToineCXgZ6zH0w3QkQY4V5J8pbYtHmxfRunhQ";
   //var jsondata = {"items": [{"book": "John", "chapter": "3", "verse": "16", "word": "For God"}]};
   var data = JSON.stringify(jsondata);
   var path = "memoryverses.json";

   //alert(data);
   var xhttp = new XMLHttpRequest();
   xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200){
       //alert("changes saved successfully");
	}else{
	    //alert(this.responseText);
		if (this.responseText.includes("Invalid authorization value") || this.responseText.includes("access token is malformed")){
		  alert("wrong token");
		  localStorage.removeItem("dropboxtoken");		  
		}
	 }
 
    };
   xhttp.open("POST", "https://content.dropboxapi.com/2/files/upload", true);
   xhttp.setRequestHeader("Authorization", "Bearer " + dropboxtoken); 
   xhttp.setRequestHeader("Dropbox-API-Arg", "{\"path\": \"/"+path+"\",\"mode\": \"overwrite\",\"autorename\": true,\"mute\": false,\"strict_conflict\": false}");
   xhttp.setRequestHeader("Content-Type", "application/octet-stream");
   xhttp.send(data);
}