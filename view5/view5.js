'use strict';


var app = angular.module('myApp.view5', ['ngRoute']);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view5', 
    {templateUrl: 'view5/view5.html',
    controller: 'View5Ctrl'}).when('/view5/book/:book/chapter/:chapter', {
    templateUrl: 'view5/view5.html',
    controller: 'View5Ctrl'
  }).when('/view5/book/:book/chapter/:chapter/verse/:verse', {
    templateUrl: 'view5/view5.html',
    controller: 'View5Ctrl'
  }).otherwise('/view5');
}])

.controller('View5Ctrl', function($scope, $routeParams, $http, $interval, cssInjector) {
    $scope.bookParam = $routeParams.book;
    $scope.chapterParam = $routeParams.chapter;
    $scope.verseParam = $routeParams.verse;
    cssInjector.add("view5/view5.css");
    $scope.selectedBook = $scope.bookParam;
    $scope.selectedChapter = parseInt($scope.chapterParam, 10);
    $scope.selectedVerse = $scope.verseParam;
    $scope.bookData = {};
    $scope.chapterData = [];
    $scope.kjv = "";
    $scope.loading = true;
       $http.get("assets/booksAndVerses.json")
       .then(function(response) {
         $scope.kjv = response.data;
         $scope.bookData = $scope.kjv;
         $scope.loading = false;
         $scope.bookData[$scope.selectedBook] = $scope.kjv[$scope.selectedBook];
         $scope.chapterData = $scope.bookData[$scope.selectedBook].filter(item => item.chapter === $scope.selectedChapter);     
       }, function(response) {
               $scope.kjv = response.data || 'Request failed';
    });

    $scope.bookChange = function(element) {
        $scope.selectedBook = element.currentTarget.value;
        $scope.bookData[$scope.selectedBook] = $scope.kjv[$scope.selectedBook];

    };
    $scope.chapterChange = function(element) {
        $scope.selectedChapter = parseInt(element.currentTarget.value, 10)+1;
        $scope.chapterData = $scope.bookData[$scope.selectedBook].filter(item => item.chapter === $scope.selectedChapter);

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