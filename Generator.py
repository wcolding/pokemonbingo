from ObjectiveTypes import ObjectiveType
from Pokedex import Pokedex
import json
import random

class PokemonBoardGenerator:

    def __init__(self):
        self.pokedex = Pokedex()

    # Takes either an int or ObjectiveType parameter and removes it from a list
    def __RemoveFamily(self, objType, pokeList):
        objVal = objType
        if type(objType) == ObjectiveType:
            objVal = objType.value
        banned = list()
        for i in range(0, len(pokeList)):
            if pokeList[i]["objective"] == objVal:
                banned.append(pokeList[i])
        for i in banned:
            pokeList.remove(i)

    def GetPokemonFromList(self, pokeList):
        pokemon = list()
        for i in range(0, len(pokeList)):
            if pokeList[i] <= len(self.pokedex.entries):
                pokemon.append(self.pokedex.entries[pokeList[i]])
        return pokemon

    # Returns a pool of Pokemon to pass into GenerateBoard()
    def GetPokemonFromMaskFile(self, filename):
        filemon = list()
        file = open(filename, 'r')
        pokeList = file.readlines()
        for i in range(1, len(pokeList)):
            pokeList[i].replace('\n','')
            pokeList[i] = int(pokeList[i])
        pokemon = GetPokemonFromList(pokeList)
        return pokemon

    # This is the main function we should call externally
    def GenerateBoard(self, pokemonPool, maxLegendaries=0):
        random.seed()
        legendaries = 0

        picks = list()
        while len(picks) < 25:
            if len(pokemonPool) > 0:
                pIndex = random.randint(0, len(pokemonPool) - 1)
                if pokemonPool[pIndex]["objective"] == ObjectiveType.Legendary.value:
                    if legendaries < maxLegendaries:
                        picks.append(pokemonPool[pIndex]["name"])
                        self.__RemoveFamily(pokemonPool[pIndex]["objective"], pokemonPool)
                        legendaries += 1
                else:
                    picks.append(pokemonPool[pIndex]["name"])
                    self.__RemoveFamily(pokemonPool[pIndex]["objective"], pokemonPool)
            else:
                break

        #print(picks)

        if len(picks) < 25:
            return "ERROR"

        board = list()
        for i in range(0, len(picks)):
            newDict = dict()
            newDict["name"] = picks[i]
            board.append(newDict)

        jsonBoard = json.dumps(board)
        return jsonBoard