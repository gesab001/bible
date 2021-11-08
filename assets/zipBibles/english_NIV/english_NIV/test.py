import json

filename = "test3kjv.json"
file = open("test1kjv.json", "r")
jsondata = json.loads(file.read())

with open(filename, "w", encoding="utf-8") as outfile:
    json.dump(jsondata, outfile, indent=4)  