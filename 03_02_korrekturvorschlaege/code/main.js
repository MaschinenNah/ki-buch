let woerterbuch;
let levenshtein;

function preload(){
  woerterbuch = loadStrings("daten/woerterbuch.txt");
}

function setup(){
  GUI.erzeugeGUI();
  levenshtein = new Levenshtein();
}

// Callback-Funktion für GUI.eingabe.input()
function eingabe(){

  GUI.woerterAnzeige.value("");
  
  const stringA = GUI.eingabe.value();
  
  let distanzen = [];

  for (let stringB of woerterbuch){
    const distanz = levenshtein.editDistanz(stringA, stringB);
    distanzen.push([distanz, stringB]);
  }

  distanzen.sort((a, b) => a[0] - b[0]);
  distanzen = distanzen.slice(0, 10);

  for (let idx in distanzen) {
    const eintrag = distanzen[idx][0] + " " + str(distanzen[idx][1]) + "\n";
    GUI.woerterAnzeige.value(GUI.woerterAnzeige.value() + eintrag);
  }

  GUI.woerterAnzeige.value(GUI.woerterAnzeige.value().slice(0,-1))
}