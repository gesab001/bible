import json


f = open("booksAndVerses.json", "r")
jsonObj = json.loads(f.read())
f.close()
books = list(jsonObj.keys())

f = open("booksAndVerses.json", "r")
jsonObj2 =  json.loads(f.read())
f.close()

for x in books:
    verses = jsonObj2[x]
    for i in range(0, len(verses)):
      del jsonObj2[x][i]["word"]

result = {"items": jsonObj2}



"""
    print("totalverses: " + str(totalverses))
    if totalverses==0:
      del jsonObj2[x.title()]
    else:    
      topiclistobj = {x.title(): totalverses}
    sorted_topiclist2.append(topiclistobj)    
""" 

with open("booksAndVerses4.json", "w") as outfile:
  json.dump(result, outfile, indent=4, sort_keys=True)