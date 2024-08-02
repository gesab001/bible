#!/usr/bin/python3

import json

f = open("kjv-version.json")
g = open("topics3.json")
gstring = g.read()
topicjson = json.loads(gstring)
keyword = input("keyword: ")
topicjson[keyword] = []
string = f.read()
jsondata = json.loads(string)
books = jsondata["version"]
for x in range(1, 67):
    bookN = str(x)
    book = books[bookN]
    bookname = book["book_name"]

    chapters = book["book"]
    for chapterN in chapters:

       verses = chapters[chapterN]["chapter"]
       for verseN in verses:

          word = verses[verseN]["verse"]

          if keyword.lower() in word.lower():
             print(bookname + " " + chapterN + ":" + verseN)
             print(word)    
             newobj = {"book": bookname, "chapter": chapterN, "verse": verseN, "word": word}
             topicjson[keyword].append(newobj)
print(len(topicjson))                         
with open ("topics3.json", "w") as outfile:
   json.dump(topicjson, outfile, indent=4, sort_keys=True)

