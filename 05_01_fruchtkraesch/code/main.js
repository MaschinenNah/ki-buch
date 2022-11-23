let spielzustand;
let ki;
let kiSpiel = false;

function preload() {
  GUI.ladeSprites();
}

function setup() {
  GUI.erzeugeGUI();
  neuesSpiel();
  ki = new KI();
  frameRate(1);
  smooth();
}

// Die draw-Funktion wird automatisch einmal pro Sekunde aufgerufen.
// Sie veranlasst einen Zug der KI, sofern die KI spielt. 
function draw() {
  if (kiSpiel) {
    const suchtiefe = parseInt(GUI.suchtiefeWaehler.value());
    const zugKoord = ki.besterZug(spielzustand, suchtiefe);
    if(zugKoord) {
      spielzustand = spielzustand.zug(zugKoord);
    } else {
      kiSpiel = false;
    }
    GUI.zeichne(spielzustand);
  }
}

// Wird bei jedem Mausklick aufgerufen.
// Wenn der Mensch spielt, die Maus im Spielfeld ist und der angeklickte
// Stein zu einem gültigen Zug gehört, wird dieser Zug ausgeführt.
function mousePressed() {
  if (kiSpiel) {
    return;
  }
  if (GUI.mausIstImSpielfeld(mouseX, mouseY, spielzustand)) {
    let zugKoord = GUI.mausPositionZuKoordinaten(mouseX,
                                                 mouseY,
                                                 spielzustand);
    spielzustand = spielzustand.zug(zugKoord);
    GUI.zeichne(spielzustand); 
  }
}

// Callback-Funktion für GUI.neuesSpielButton.mousePressed()
function neuesSpiel() {
  const seed = GUI.seedWaehler.value();
  randomSeed(seed);
  spielzustand = new Spielzustand();
  GUI.zeichne(spielzustand);
}

// Callback-Funktion für GUI.neuesSpielKIButton.mousePressed()
function neuesSpielKI() {
  neuesSpiel();
  kiSpiel = true;
}