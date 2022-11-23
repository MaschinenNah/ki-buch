let generator;
let validierungsDaten;
let netz;

function setup(){
  noLoop();
  GUI.erzeugeGUI();
  neuesNetz();
  GUI.aktualisiereBreite();
  GUI.zeichne(datenGenerator, netz);
}

function draw() {
  trainiereBeispiele();
}

// Erzeugt 250 Trainingsbeispiele, traininert das Netz und zeigt den
// aktuellen Trainingsefolg an
function trainiereBeispiele() {
  const beispiele = datenGenerator.erzeugeBeispiele(250);
  netz.trainiereBeispiele(beispiele);
  GUI.zeichne(datenGenerator, netz);
  netz.ermittleFehler(validierungsDaten);
}

// Callback-Funktion für GUI-Elemente, welche die Aufgabe oder
// die Netzstruktur ändern und die Erzeugung eines neuen Netzes
// notwendig machen
function neuesNetz() {
  noLoop();
  // Datengenerator erzeugen...
  const bildErzeuger = window[GUI.aufgabenWaehler.value()];
  datenGenerator = new DatenGenerator(farbschema, bildErzeuger);
  validierungsDaten = datenGenerator.erzeugeBeispiele(500);

  // Anzahl der Eingangsneuronen ist _immer_ 2, weil die Eingabe
  // immer ein Koordinatenpaar ist
  const nEingangsNeuronen = 2;
  // Die Anzahl der Neuronen in den verdeckten Schichten ist abhängig von
  // den entsprechenden GUI-Elementen
  const nVerdeckteNeuronen01 = int(GUI.nNeuronenVerdeckteSchicht01Waehler.value());
  const nVerdeckteNeuronen02 = int(GUI.nNeuronenVerdeckteSchicht02Waehler.value());
  const nAusgansNeuronen = datenGenerator.nKlassen;

  // Codierung der Netzstruktur als Array
  let netzStruktur;
  if(nVerdeckteNeuronen01 == 0) {
    netzStruktur = [nEingangsNeuronen, nAusgansNeuronen];
  } else if (nVerdeckteNeuronen02 == 0) {
    netzStruktur = [nEingangsNeuronen,
                    nVerdeckteNeuronen01,
                    nAusgansNeuronen];
  } else {
    netzStruktur = [nEingangsNeuronen,
                    nVerdeckteNeuronen01,
                    nVerdeckteNeuronen02,
                    nAusgansNeuronen];
  }
  
  const lernrate = float(GUI.lernrateWaehler.value());
  netz = new Netz(netzStruktur, lernrate);
  GUI.zeichne(datenGenerator, netz);
}

// Callback-Funktion für GUI.neustartTrainingButton.mousePressed()
function neustartTraining() {
  neuesNetz();
  loop();
}

// Callback-Funktion für GUI.lernrateWaehler.changed()
function lernrateGewaehlt() {
  netz.lernrate = float(GUI.lernrateWaehler.value());
}

// Callback-Funktion für GUI.pauseButton.mousePressed()
function pause_() {
  if (isLooping()) {
    noLoop();
  } else {
    loop();
  }
}