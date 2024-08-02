#!/usr/bin/python3

import json

f = open("kjv-version.json")
g = open("topics3.json")
gstring = g.read()
topicjson = json.loads(gstring)
topics = list(topicjson.keys())
print(topics)

keyword = input("keyword to delete: ")
del topicjson[keyword]            
with open ("topics3.json", "w") as outfile:
   json.dump(topicjson, outfile, indent=4)

