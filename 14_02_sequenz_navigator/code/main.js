let worteinbettung;
let sequenzeinbettung;

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
  let zeilen = loadStringPromise("daten/" + verzeichnis + "/zeilen.txt");

  Promise.all([wortZuVektorDict, 
               wortZuVektorDict2D, 
               metadaten, 
               zeilen]).then(resultate => {
    console.log("Einbettung " + verzeichnis + " erfolgreich geladen.");
    worteinbettung = new Worteinbettung(...resultate);
    worteinbettung.initialisiere();
    sequenzeinbettung = new Sequenzeinbettung(worteinbettung);
    sequenzeinbettung.initialisiere();
    GUI.reset();

  }).catch(error => {
    console.error("Einbettung " + verzeichnis + "konnte nicht geladen werden:", error);
  });
}


//Callback-Funktion für GUI.texteingabe.changed()
function sequenzEingegeben() {
  const sequenz = GUI.texteingabe.value();
  const nachbarn = sequenzeinbettung.nachbarn(sequenz, "dict", 5);
  GUI.leereBerichtUnten();

  for (let nachbar of nachbarn) {
    GUI.berichtUnten(nachbar.aehnlichkeit.toFixed(6));
    GUI.berichtUnten(nachbar.zeile);
    GUI.berichtUnten();
  }
  redraw();
}

function draw() {
  background(200);
  if (sequenzeinbettung && sequenzeinbettung.istInitialisiert) {
    GUI.zeichneSequenzeinbettung(sequenzeinbettung);
  }
}

function mousePressed() {
  GUI.mousePressed(mouseX, mouseY);
}

function mouseReleased() {
  GUI.mouseReleased(mouseX, mouseY);
}