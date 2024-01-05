from ObjectiveTypes import ObjectiveType
import json

class Pokedex:

    def __init__(self):
        file = open('Pokedex.json', 'r')
        rawDex = file.read()
        self.entries = list(tuple(json.loads(rawDex)))
        #print(entries)
        file.close()

    # Writes the modified entries to the file
    def pack(self):
        file = open('Pokedex.json', 'w')
        output = json.dumps(self.entries, indent = 2)
        file.writelines(output)
        file.close()

    # Appends a new entry with specified string name and numeric ObjectiveType
    def addEntry(self, name, objType):
        objVal = objType;
        if type(objType) == ObjectiveType:
            objVal = objType.value
        newEntry = dict({"name": name, "objective": objVal})
        self.entries.append(newEntry)