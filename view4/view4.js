'use strict';


var app = angular.module('myApp.view4', ['ngRoute']);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view4', 
    {templateUrl: 'view4/view4.html',
    controller: 'View3Ctrl'}).when('/view4/book/:book/chapter/:chapter', {
    templateUrl: 'view4/view4.html',
    controller: 'View3Ctrl'
  }).when('/view4/book/:book/chapter/:chapter/verse/:verse', {
    templateUrl: 'view4/view4.html',
    controller: 'View4Ctrl'
  }).otherwise('/view4');
}])

.controller('View4Ctrl', function($scope, $routeParams, $http, $interval, cssInjector) {
    $scope.keyword = "Jesus";
    $scope.bubble = false;
    $scope.keyword = $routeParams.keyword
    $scope.showresults = true;
    cssInjector.add("view4/view4.css");

    $scope.kjv = "";
    $scope.loading = true;
       $http.get("assets/booksAndVerses.json")
       .then(function(response) {
         $scope.kjv = response.data;
      
       }, function(response) {
               $scope.kjv = response.data || 'Request failed';
    });

    $scope.search = function(element) {
        $scope.keyword = element.currentTarget.value;
        $scope.showresults = true;
    };

    $scope.newSearch = function(element) {
        $scope.bubble = false;
    };
    
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
   $scope.translate = function(translationversion, bookname, id){
        $scope.translationbookname = bookname;
        if ($scope.translationbookname=="Acts (of the Apostles)"){
           $scope.translationbookname = "Acts";
 
        }
        $scope.translatebooknumber = $scope.bibles[bookname];   
        if (translationversion=="textusreceptus" && $scope.translatebooknumber<40){
                $scope.kjv[bookname][id].word = "no translation for this version. Try Greek OT";  

        }else if (translationversion=="greekot" && $scope.translatebooknumber>39) {
                $scope.kjv[bookname][id].word = "no translation for this version. Try Greek Textus Receptus";  

        }else if (translationversion=="hebrew" && $scope.translatebooknumber>39) {
                $scope.kjv[bookname][id].word = "no translation for this version. Try Modern Hebrew";  
        }
        else{
            $scope.kjv[bookname][id].word = "translating... please wait";  
//                                    $scope.kjv[bookname][id].word = $scope.translationbookname;

            $scope.translatebook = $scope.kjv[bookname];
            $scope.translatetotalverses = $scope.translatebook.length;
            $scope.translatecurrentid = id;
            $scope.translatecurrentVerse = $scope.translatebook[$scope.translatecurrentid];
            $scope.translatebooknumber = $scope.bibles[$scope.translationbookname];
            $scope.translatechapter = $scope.translatecurrentVerse.chapter;
            $scope.translateverse = $scope.translatecurrentVerse.verse;

            $http.get("assets/versions/"+translationversion+"-version.json")
                  .then(function(response) {
                    $scope.translationbible = response.data;
                    try{
                        $scope.translatedword = $scope.translationbible["version"][$scope.translatebooknumber]["book"][$scope.translatechapter]["chapter"][$scope.translateverse]["verse"];
                        $scope.kjv[bookname][id].word = $scope.translatedword;


                    }catch(err){
                          $scope.kjv[bookname][id].word = "Sorry. no translation for this version. Perhaps this verse is not available in the King James Version.";      
                    }


                  }, function(response) {
                          $scope.translation = response.data || 'Request failed';
               }); 
        }
    
        
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
