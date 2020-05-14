'use strict';


var app = angular.module('myApp.view1', ['ngRoute']);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', function($scope, $http, $interval) {
    //$http.defaults.headers.common["api-key"] = "80e4d9935ef1778c43ecd7801bd4ae4c";
    $scope.kjv = "";
       $http.get("view1/topics3.json")
       .then(function(response) {
         $scope.kjv = response.data;
       }, function(response) {
               $scope.kjv = response.data || 'Request failed';
    });
    $scope.booknumbers = "";  
    $scope.id = getCurrentID();
    //get booklist
    $http.get("assets/booklist2.json")
    .then(function(response) {
      $scope.bibles = response.data.books;
      $scope.versionoptions = response.data.versionoptions;
      $scope.selectedVersion = "kjv";
         //get kjv bible
        
    }, function(response) {
            $scope.bibles = response.data.books || 'Request failed';
    });
    
 
    $scope.getWord = function (book, id){
        $scope.totalverses = $scope.kjv[book].length;
        $scope.currentID = id%$scope.totalverses;
        $scope.currentVerse = $scope.kjv[book][$scope.currentID];
        $scope.chapterNumber = $scope.currentVerse.chapter;
        $scope.verseNumber = $scope.currentVerse.verse;
        return $scope.currentVerse.word;
    };
   $scope.translate = function(translationversion, title, bookname, id){
      
    $scope.translatebook = $scope.kjv[title];
    $scope.translatetotalverses = $scope.translatebook.length;
    $scope.translatecurrentid = id;
    $scope.translatecurrentVerse = $scope.translatebook[$scope.translatecurrentid];
    $scope.translatebooknumber = $scope.bibles[bookname];
    $scope.translatechapter = $scope.translatecurrentVerse.chapter;
    $scope.translateverse = $scope.translatecurrentVerse.verse;
//
    $http.get("assets/versions/"+translationversion+"-version.json")
          .then(function(response) {
            $scope.translationbible = response.data;
            try{
                $scope.translatedword = $scope.translationbible["version"][$scope.translatebooknumber]["book"][$scope.translatechapter]["chapter"][$scope.translateverse]["verse"];
                        $scope.kjv[title][id].word = $scope.translatedword;

            }catch(err){

            }
          
             
          }, function(response) {
                  $scope.translation = response.data || 'Request failed';
       });
//        
         //get kjv bible
        
  
   };
    $scope.theTime = new Date().toLocaleTimeString();
    $interval(function () {
        $scope.theTime = new Date();
        $scope.id = getCurrentID();
    }, 1000);
    //get versions list
//    $http.get("view1/versions_json.json")
//    .then(function(response) {
//
//      $scope.versionslist = response.data.versionslist;
//      $scope.versionoptions = response.data.versionoptions;
//      for (var v of $scope.versionslist){
//          
//          $scope.versions.choices.push({"version": $scope.versionoptions[v], "code": v});
//      }
//      $scope.id = getCurrentID();
//      
//    });
//    $scope.theTime = new Date().toLocaleTimeString();
//    $interval(function () {
//        $scope.theTime = new Date();
//        $scope.id = getCurrentID()
//    }, 1000);
    
 
    
    
}); 

function getCurrentID(){

    var date1 = new Date();
    var date2 = new Date(2018, 5, 23, 14, 45, 0, 0);
    var difference = date1.getTime() - date2.getTime();
    var minutesDifference = Math.floor(difference/1000/60);
    var currentID=minutesDifference;
    return currentID;
}
