let worteinbettung;

function setup(){
  GUI.erzeugeGUI();
  einbettungGewaehlt()
  frameRate(10);
  noLoop();
  fill(0);
}

// Callback-Funktion für GUI.einbettungsWaehler.changed()
function einbettungGewaehlt() {
  GUI.reset();
  let verzeichnis = GUI.einbettungsWaehler.value();
  let wortZuVektorDict = loadJSONPromise("daten/" + verzeichnis + "/vektoren.json");
  let wortZuVektorDict2D = loadJSONPromise("daten/" + verzeichnis + "/vektoren2D.json");
  let metadaten = loadJSONPromise("daten/" + verzeichnis + "/metadaten.json");
  let qualitaet = loadStringPromise("daten/" + verzeichnis + "/qualitaet.txt");
  let zeilen = loadStringPromise("daten/" + verzeichnis + "/zeilen.txt");

  Promise.all([wortZuVektorDict, 
               wortZuVektorDict2D, 
               metadaten, 
               qualitaet, 
               zeilen]).then(resultate => {
    console.log("Einbettung " + verzeichnis + " erfolgreich geladen.");
    worteinbettung = new Worteinbettung(...resultate);
    worteinbettung.initialisiere();
  }).catch(error => {
    console.error("Einbettung " + verzeichnis + "konnte nicht geladen werden:", error);
  });
}

  

function draw() {
  if (worteinbettung && worteinbettung.istInitialisiert) {
    GUI.zeichneWorteinbettung(worteinbettung);
  }
}

function mousePressed() {;
  GUI.mousePressed(mouseX, mouseY);
}

function mouseReleased() {
  GUI.mouseReleased(mouseX, mouseY);
}