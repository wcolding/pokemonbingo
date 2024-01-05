from flask import Flask, request, render_template
from Generator import PokemonBoardGenerator
from Pokedex import Pokedex
import datetime
import json

app = Flask(__name__)

latestVersion = datetime.datetime.now() # workaround to avoid browser loading cached App.js file
fullDex = Pokedex()

gen = PokemonBoardGenerator()

numberedPokemon = list()

for p in range(0, len(fullDex.entries)):
    pokemonString = "{:0>3d}".format(p+1) + " - " + fullDex.entries[p]["name"]
    numberedPokemon.append(pokemonString)

presetFile = open('static/presets.json', 'r')
pmaskstring = presetFile.read()
pmaskobj = json.loads(pmaskstring)
presetFile.close()

@app.route('/')
def index():
    return render_template('App.html', version = latestVersion, Dex = numberedPokemon, masks = pmaskobj, generated = "")

@app.route('/generate', methods = ['POST'])
def generate():
    _maxL = request.form.get("maxLeg")
    _mask = request.form.get("curMask")
    curMask = json.loads(_mask)
    curPool = gen.GetPokemonFromList(curMask)
    board = gen.GenerateBoard(curPool, int(_maxL))
    print(board)
    return render_template('App.html', version = latestVersion, Dex = numberedPokemon, masks = pmaskobj, generated = board)

if __name__ == '__main__':
    app.run()