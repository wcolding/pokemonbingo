var pdex = document.getElementById("Pokedex");
var pool = document.getElementById("Pool");
var presets = Object();
var curMask = document.getElementById("CurMask");
var curLegs = document.getElementById("MaxLs");
var output = document.getElementById("Output");
var copiedText = document.getElementById("Copied");

// Moves Pokemon out of the Pokedex and into the Pool
function addPokemon()
{
    moveSelectedOptions(pdex, pool);
    saveLocalPool();
}

// Moves Pokemon out of the Pool and into the Pokedex
function removePokemon()
{
    moveSelectedOptions(pool, pdex);
    saveLocalPool();
}

// Moves selected options from select box a to select box b
function moveSelectedOptions(a, b)
{
    var buffer = document.createElement("select");

    for (var i = 0; i < a.options.length; i++) {
        var pokemon = a.options[i];
        if (pokemon.selected) {
            var newPokemon = document.createElement("option");
            newPokemon.text = pokemon.text;
            buffer.options.add(newPokemon);
        }
    }

    for (var i = 0; i < buffer.options.length; i++) {
        var newPokemon = document.createElement("option");
        newPokemon.text = buffer.options[i].text;

        // Add to b select
        var bLen = b.options.length;

        if (bLen > 0) {
            for (var p = 0; p < bLen; p++) {
                if (b.options[p].text != newPokemon.text)
                    b.options.add(newPokemon);
            }
        }
        else {
            b.options.add(newPokemon);
        }

        // Remove from a select
        var aLen = a.options.length;

        if (aLen > 0) {
            for (var p = 0; p < aLen; p++) {
                if (a.options[p].text == newPokemon.text) {
                    a.options.remove(p);
                    break;
                }
            }
        }

    }

    sortSelectBox(b);
    updateCurMask();
}

function sortSelectBox(selectBox)
{
    var newOptions = Array();
    for (var i = 0; i < selectBox.options.length; i++)
    {
        newOptions.push(selectBox.options[i].text);
    }
    newOptions.sort();

    for (var i = 0; i < newOptions.length; i++)
    {
        selectBox.options[i].text = newOptions[i];
    }
}

function resetSelectBoxes()
{
    for (var i = 0; i < pool.options.length; i++)
        pool.options[i].selected = true;

    moveSelectedOptions(pool, pdex);
}

function applyMask(mask)
{
    resetSelectBoxes();

    for (var i = 0; i < mask.length; i++)
    {
        pdex.options[mask[i]].selected = true;
    }

    moveSelectedOptions(pdex, pool);
}

function loadPreset(msg=true)
{
    var presetsBox = document.getElementById("Presets");
    var selectedPreset = presetsBox.options.selectedIndex;

    if (selectedPreset >= 0)
    {
        var IDs = Array();
        for (var i = 0; i < presets[selectedPreset].ids.length; i++)
        {
            IDs.push(presets[selectedPreset].ids[i]);
        }
        applyMask(IDs);
        saveLocalPool();
    }
    if (msg == true)
    {
        messageUser("Loaded preset", 1000);
    }
}

function savePreset()
{
    var presets;
    if (localStorage.presets != null) {
        presets = JSON.parse(localStorage.presets);
    }
    else
    {
        presets = Array();
    }

    var presetName = prompt("Enter a name for this preset", "");

    if (presetName != null || presetName != "")
    {
        var mon = getPoolIndexList();
        var objMon = { "name": presetName, "ids": mon };
        presets.push(objMon);
        localStorage.presets = JSON.stringify(presets);
        console.log(localStorage.presets);
    }
    init();
    messageUser("Saved preset", 1000);
}

function getPoolIndexList()
{
    var PoolMons = Array();
    for (var i = 0; i < pool.options.length; i++)
    {
        var pokemonID = dex.indexOf(pool.options[i].text);
        if (pokemonID >= 0)
            PoolMons.push(pokemonID);
    }
    return PoolMons;
}

function logCurSet()
{
    var mon = getPoolIndexList();
    var objMon = { "name": "User List", "ids": mon };
    var jsonMon = JSON.stringify(objMon);
    console.log(jsonMon);
}

function updateCurMask()
{
    curMask.value = JSON.stringify(getPoolIndexList());
    console.log(curMask.value);
}

function saveLocalPool()
{
    var mon = getPoolIndexList();
    var objMon = { "name": "User List", "ids": mon };
    var jsonMon = JSON.stringify(objMon);
    localStorage.lastBank = jsonMon;
}

function loadLocalPool()
{
    if (localStorage.lastBank != null)
    {
        var jsonMon = localStorage.lastBank;
        var mon = JSON.parse(jsonMon);
        applyMask(mon.ids);
    }
}

function init()
{
    loadLocalPool();
    var presetSelect = document.getElementById("Presets");
    var loadDefaultPreset = false;

    if (localStorage.presets != null)
    {
        presets = JSON.parse(localStorage.presets);
        var preLen = presets.length;
        for (var i = 0; i < pmasks.length; i++)
            presets[preLen + i] = pmasks[i];
    }
    else
    {
        presets = pmasks;
        loadDefaultPreset = true;
    }

    for (var i = presetSelect.options.length - 1; i >= 0; i--)
    {
        presetSelect.remove(i);
    }

    for (var i = 0; i < presets.length; i++)
    {
        var newOption = document.createElement("option");
        newOption.text = presets[i].name;
        presetSelect.add(newOption);
    }

    switch (output.innerText)
    {
        case ("ERROR"):
            messageUser("Unable to generate 25 squares. Try a larger pool of Pokemon!", 2000);
            break;
        case (""):
            break;
        default:
            messageUser("Board generated! Click Ditto to copy to clipboard!", 2000);
            break;
    }

    if (loadDefaultPreset)
    {
        loadPreset(false);
    }

    if (localStorage.lastLegendaries != null)
    {
        curLegs.value = localStorage.lastLegendaries;
    } else
    {
        curLegs.value = 0;
    }
}

function clearUserPresets()
{
    var clear = confirm("Clear all user presets? This cannot be undone.");
    if (clear == true)
    {
        localStorage.removeItem("presets");
        presets = new Object();
        init();
    }
}

function copyOutput()
{
    switch (output.innerText) {
        case ("ERROR"):
            messageUser("Unable to generate 25 squares. Try a larger pool of Pokemon!", 2000);
            break;
        case (""):
            messageUser("No board to copy!", 1000);
            break;
        default:
            navigator.clipboard.writeText(output.innerText);
            messageUser("Copied to clipboard!", 1000);
            break;
    }

}

// Write a message that fades after a period of time
function messageUser(msg, time)
{
    copiedText.innerText = msg;
    copiedText.style.opacity = 1;
    setTimeout(() => { copiedText.style.opacity = 0; }, time);
}

function changedNumLegendaries() {
    localStorage.lastLegendaries = curLegs.value;
}