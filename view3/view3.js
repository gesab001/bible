'use strict';


var app = angular.module('myApp.view3', ['ngRoute']);
var nextslide = document.getElementById("next");
app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view3', 
    {templateUrl: 'view3/view3.html',
    controller: 'View3Ctrl'}).when('/view3/book/:book/chapter/:chapter', {
    templateUrl: 'view3/view3.html',
    controller: 'View3Ctrl'
  }).when('/view3/book/:book/chapter/:chapter/verse/:verse', {
    templateUrl: 'view3/view3.html',
    controller: 'View3Ctrl'
  }).otherwise('/view3');
}])

.controller('View3Ctrl', function($scope, $routeParams, $http, $interval, cssInjector) {
    $scope.isSlideShow = true;
    $scope.currentFontSize = 1;
    $scope.bookParam = $routeParams.book;
    $scope.chapterParam = $routeParams.chapter;
    $scope.verseParam = $routeParams.verse;
    cssInjector.add("view3/view3.css");
    $scope.selectedBook = $scope.bookParam;
    $scope.selectedChapter = parseInt($scope.chapterParam, 10);
    $scope.selectedVerse = $scope.verseParam;
    $scope.selectedMemoryVerseNumber = "";
    $scope.selectedWord = "";
    $scope.bookData = {};
    $scope.stories = "";
    $scope.storyData = {"title": "", "slides": [], "questions": [], "activities": [], "references": [], "poster": "https://www.hoteldonandres.com/wp-content/uploads/2016/10/blackboard.jpg"};

    $scope.loadImage = function() {
         console.log("update image");
	     localStorage.setItem("draftStory", JSON.stringify($scope.storyData));
	     console.log($scope.storyData);
    };


    $scope.updateTitle = function() {
         console.log("update title");
	     localStorage.setItem("draftStory", JSON.stringify($scope.storyData));
	     console.log($scope.storyData);
    };
    $scope.updateText = function() {
         console.log("update title");
	     localStorage.setItem("draftStory", JSON.stringify($scope.storyData));
	     console.log($scope.storyData);
    };
   $scope.newStory = {"title": "title", "otherTitle": "", "description": "", "categories": "", "newcoverposter": ""};
   $scope.makeThisTheCoverPoster = function (url){
       $scope.newStory.newcoverposter = url;
    }; 
   $scope.storyText = "";
    $scope.memoryVerseList = [];
    $scope.createAStory = function(){
	if(localStorage.getItem("draftStory")) {
          console.log("draftStory exists");
          console.log(JSON.parse(localStorage.getItem("draftStory")));
        
	  $scope.storyData = JSON.parse(localStorage.getItem("draftStory"));
          $scope.generateSlidesDraft();
	} else {
	     $scope.storyData = {"title": "title", "slides": [], "questions": [], "activities": [], "references": [], "poster": "https://www.hoteldonandres.com/wp-content/uploads/2016/10/blackboard.jpg"};
          $scope.storyText = "";
              for (const item of $scope.memoryVerseList) {
                  $scope.storyText +=  item.verse + " splithere " + item.word + "\n";
             }
	/*      for (const item of $scope.memoryVerseList) {
		     var text = item.word;
		     var reference = {"book": item.book, "chapter": item.chapter, "verse": {"start": item.verse, "end": item.verse} };
		     var urlImage = "https://www.hoteldonandres.com/wp-content/uploads/2016/10/blackboard.jpg";
		     var question = {"question": "", "answer": "", "choices": ["", "", "", ""]};
		     var jsonObj = {"text": text, "reference": reference, "image": urlImage};

		     $scope.storyData.slides.push(jsonObj);
		     $scope.storyData.questions.push(question);
		}

	     console.log($scope.storyData);
	     localStorage.setItem("draftStory", JSON.stringify($scope.storyData));
	     localStorage.setItem("memoryVerseList", JSON.stringify($scope.memoryVerseList));*/
	}

			var dropboxtoken = "ov1Fn0M5gUgAAAAAAAAAAUH__lAitVjxIuHNTfxKDKUvWPyyElPaTre_sLqx26g2";
            var path = "stories.json";
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
			         $scope.stories = response.data;
				 console.log($scope.stories.atoz);
				
			   }, function(response) {
					   console.log( 'Request failed');
			});

 
    };


    $scope.generateSlides = function() {
        var text = document.getElementById("rawText").innerText.split("\n\n\n");
        console.log(text);
	$scope.storyData = {"title": "title", "slides": [], "questions": [], "activities": [], "references": [], "poster": "https://www.hoteldonandres.com/wp-content/uploads/2016/10/blackboard.jpg"};
         for (const item of text) {

                     var verseStart = item.split("splithere")[0].split("-")[0];
                     
                     var verseEnd = item.split("splithere")[0].split("-")[1];
                     console.log(verseEnd);
                     if (verseEnd===undefined){
                          verseEnd = verseStart;
                     }
		     var word = item.split("splithere")[1];
		     var reference = {"book": $scope.selectedBook, "chapter": $scope.selectedChapter, "verse": {"start": verseStart, "end": verseEnd} };
		     var urlImage = "https://www.hoteldonandres.com/wp-content/uploads/2016/10/blackboard.jpg";
		     var question = {"question": "", "answer": "", "choices": ["", "", "", ""]};
		     var jsonObj = {"text": word, "reference": reference, "image": urlImage};

		     $scope.storyData.slides.push(jsonObj);
		     $scope.storyData.questions.push(question);
		}


    };

    $scope.generateSlidesDraft = function() {
         $scope.memoryVerseList = [];
         for (const item of $scope.storyData.slides) {
                     var book = item.reference.book;
                     var chapter = item.reference.chapter;
                     var verse = item.reference.verse.start;                   
		     var word = item.text;
		     var reference = {"book": book, "chapter": chapter, "verse": verse, "word": word};
                     $scope.memoryVerseList.push(reference);

		    // $scope.storyData.slides.push(jsonObj);
		    // $scope.storyData.questions.push(question);
		}


    };
 
    $scope.getFilledQuestions = function(item) {
       if (item.question!="")
           return item.question;
    }; 
    $scope.checkForEmptyQuestions = function(item) {
       if (item.question=="")
           return true;
    };
    
  /*  $scope.checkStoryExists = function(item) {
       if (item.names!="")
           return item.question;
    } */

    $scope.publish = function(){
       var questions = $scope.storyData.questions.filter($scope.getFilledQuestions);
     //  console.log($scope.stories.atoz(checkStoryExists);
       var numberofslides = $scope.storyData.slides.length;
       $scope.storyData.questions = questions;
       console.log("number of slides: " + numberofslides);
       if($scope.storyData.questions.length!=5){
            alert("you have " + questions.length + " questions.  You have must 5 questions only.");
       }
       else if($scope.storyData.title=="title"){
          alert("please enter title for story");
       }else if ($scope.newStory.newcoverposter=="") {
          alert("please choose a cover poster");
       }else if ($scope.storyData.slides.length!=10){
           alert("you have " + $scope.storyData.slides + " slides.  You have must have 10 slides.");
       }
        else{   
               var title = $scope.storyData.title;
               var otherTitle = $scope.newStory.otherTitle;
               var categories = $scope.newStory.categories.split(",");
               var description = $scope.newStory.description;
               var newcoverposter = $scope.newStory.newcoverposter;
               var video = otherTitle + ".mp4";
               var thumbnail = $scope.storyData.poster;
               var newEntry = {"title": title, "otherTitle": otherTitle, "categories": categories, "description": description, "newcoverposter": newcoverposter, "thumbnail": thumbnail, "video": video};


               //delete empty question slot
               //console.log($scope.storyData.questions.filter($scope.getFilledQuestions));

               var alphabet = otherTitle.charAt(0).toUpperCase();
               var letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
               var letterIndex = letters.indexOf(alphabet);
               
               $scope.stories.atoz[letterIndex].names.push(newEntry);
               $scope.stories.new.push(newEntry);

               updateStoryDatabase($scope.stories);
	       updateStory($scope.storyData);
	       //$scope.storyData = {"title": "", "slides": [], "questions": questions, "activities": [], "references": [], "poster": "https://www.hoteldonandres.com/wp-content/uploads/2016/10/blackboard.jpg"};
	      // $scope.memoryVerseList = [];
	     //  localStorage.removeItem("draftStory");
	     //  localStorage.removeItem("memoryVerseList");

	    // console.log("removed");
       }
    };


   $scope.clearStory = function(){
       localStorage.removeItem("draftStory");
       localStorage.removeItem("memoryVerseList");
       $scope.memoryVerseList = [];
       $scope.storyData = {"title": "", "slides": [], "questions": [], "activities": [], "references": [], "poster": "https://www.hoteldonandres.com/wp-content/uploads/2016/10/blackboard.jpg"};
       console.log("removed");
    };

    $scope.updateQuestion = function(index) {
       //  var inputs = document.forms["questions0"].getElementsByTagName("input");
         console.log(index);
      $scope.storyData.questions[index].choices[0] = $scope.storyData.questions[index].answer;
      console.log($scope.storyData.questions);
      localStorage.setItem("draftStory", JSON.stringify($scope.storyData));
   };

		$scope.addAMemoryVerse = function(book, chapter, verse, word){
			//$scope.selectedMemoryVerseNumber = verse;
			console.log($scope.selectedMemoryVerseNumber);
			//$scope.selectedWord = word;
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
				 var memoryVerses = response.data;
				 for (const item of $scope.memoryVerseList) {
					  $scope.selectedWord += item.word + " ";
					  $scope.selectedMemoryVerseNumber += item.verse.toString() + ", ";
					}
				 $scope.selectedMemoryVerseNumber = $scope.selectedMemoryVerseNumber.slice(0, -2);	
				 var verseObj = {"book": $scope.selectedBook, "chapter": $scope.selectedChapter, "verse": $scope.selectedMemoryVerseNumber.toString(), "word": $scope.selectedWord}; 
				 console.log(verseObj);
				 memoryVerses.push(verseObj);
                 updateMemoryVerse(memoryVerses);
                               $scope.selectedMemoryVerseNumber = "";
                               $scope.selectedWord = "";
			   }, function(response) {
					   console.log( 'Request failed');
			});
    
    };  
 
    $scope.deleteSlide = function(event, index){
        //event.target.parentNode.removeChild(event);
        var olNode = event.target.parentNode;
        var slideList = event.target.parentNode.parentNode;
        slideList.removeChild(olNode);

        $scope.storyData.slides.splice(index, 1);
        console.log($scope.storyData.slides);
        localStorage.setItem("draftStory", JSON.stringify($scope.storyData));

        //$scope.memoryVerseList.splice(index, 1);
	//localStorage.setItem("memoryVerseList", JSON.stringify($scope.memoryVerseList));
    };   
    $scope.insertVerse = function(verse){
          if(verse.isChecked){
              $scope.memoryVerseList.push(verse);

          }else{
              var filtered = $scope.memoryVerseList.filter(function(value, index, arr){ 
                   return value != verse;});
              $scope.memoryVerseList = filtered;
              $scope.memoryVerseList.sort((a, b) => (a.verse > b.verse) ? 1 : -1);
              console.log($scope.memoryVerseList);              
          }
	  localStorage.setItem("memoryVerseList", JSON.stringify($scope.memoryVerseList));
    };
	
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
    
    $scope.slideShowOn = function() {
        console.log($scope.chapterData);
        $scope.setFontSize();

    };
    
    
    $scope.markWord = function(word) {
        //console.log(word);
        var wordlist = word.split(" ");
        //console.log(result);
        return wordlist;

    };
    $scope.setFontSize = function() {   
        $scope.currentFontSize = getFontSize(); 

        var el = document.getElementsByClassName("wordFontSize");
        //console.log(el);
        for (var x=0; x<el.length; x++){              
           el[x].style.fontSize = $scope.currentFontSize + "rem";
        }
        
    };


    $scope.decreaseFont = function() {
        console.log('decrease font');
       var el = document.getElementsByClassName("wordFontSize");
        $scope.currentFontSize = $scope.currentFontSize - 0.1;
        if($scope.currentFontSize<1){
            $scope.currentFontSize = 1;
        }else{
            //console.log(el);
            for (var x=0; x<el.length; x++){

                el[x].style.fontSize = $scope.currentFontSize + "rem";
            }
        }
        saveFontSize($scope.currentFontSize); 

    };
    $scope.increaseFont = function() {
        console.log('increase font');
        var el = document.getElementsByClassName("wordFontSize");
        $scope.currentFontSize = $scope.currentFontSize + 0.1;
        //console.log(el);
        for (var x=0; x<el.length; x++){
            
            
            el[x].style.fontSize = $scope.currentFontSize + "rem";
        }
        saveFontSize($scope.currentFontSize); 

      

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



function clickOnUpload() {

};

function getFontSize(){
    if (localStorage.getItem("fontSizeBibleSlideshow") === null) {
        localStorage.setItem("fontSizeBibleSlideshow", "1");     
    }
    var savedSize = localStorage.getItem("fontSizeBibleSlideshow");
    return parseInt(savedSize);
}

function saveFontSize(currentFontSize){
     localStorage.setItem("fontSizeBibleSlideshow", currentFontSize.toString());
}

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
        // alert("memory verse added successfully");
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



function updateStoryDatabase(jsondata){
   console.log("add story");
   console.log(jsondata);
   var dropboxtoken = "ov1Fn0M5gUgAAAAAAAAAAUH__lAitVjxIuHNTfxKDKUvWPyyElPaTre_sLqx26g2";
   //var jsondata = {"items": [{"book": "John", "chapter": "3", "verse": "16", "word": "For God"}]};
   var data = JSON.stringify(jsondata);
   var path = "stories.json";

   //alert(data);
   var xhttp = new XMLHttpRequest();
   xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200){
       //alert("changes saved successfully");
        // alert("memory verse added successfully");
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

function updateStory(jsondata){
   console.log("add story");
   console.log(jsondata);
   var dropboxtoken = "ov1Fn0M5gUgAAAAAAAAAAUH__lAitVjxIuHNTfxKDKUvWPyyElPaTre_sLqx26g2";
   //var jsondata = {"items": [{"book": "John", "chapter": "3", "verse": "16", "word": "For God"}]};
   var data = JSON.stringify(jsondata);
   var path = "articles/"+jsondata.title + ".json";

   //alert(data);
   var xhttp = new XMLHttpRequest();
   xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200){
       //alert("changes saved successfully");
        // alert("memory verse added successfully");
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



