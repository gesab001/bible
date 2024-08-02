#!/usr/bin/python3
import subprocess
import json

f = open("kjv-version.json")
g = open("memory_verse.json")
gstring = g.read()
topicjson = json.loads(gstring)
string = f.read()
jsondata = json.loads(string)
books = jsondata["version"]
bookinput = input("book: ")
chapter = input("chapter: ")
versestart = input("versestart: ")
verseend = input("verseend: ")

for x in range(1, 67):
    bookN = str(x)
    book = books[bookN]
    bookname = book["book_name"]

    if bookinput==bookname  :
        print(bookinput + "==" + bookname) 
        chapters = book["book"]
        for chapterN in chapters:         
           if str(chapterN)==str(chapter):
               print(chapter + "==" + chapterN)
               verses = chapters[chapterN]["chapter"]
               word = ""
               verseRange = versestart
               if versestart!=verseend:
                 verseRange = versestart + "-" + verseend
               
               for verseN in range(int(versestart), int(verseend)+1):
                      word = word + verses[str(verseN)]["verse"]                    
               print(bookname + " " + chapterN + ":" + str(verseN))
               print(word)    
               newobj = {"book": bookname, "chapter": chapterN, "verse": verseRange,  "word": word}
               topicjson["items"].append(newobj)
                         
with open ("memory_verse.json", "w") as outfile:
   json.dump(topicjson, outfile, indent=4)


subprocess.call("../deploy.sh", shell=True)
