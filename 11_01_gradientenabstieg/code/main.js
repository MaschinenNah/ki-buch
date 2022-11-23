let xAktuell;
let schrittButtonIstGedrueckt = false;

function setup(){
  GUI.erzeugeGUI();
  xNeu();
  GUI.zeichne(xAktuell, funktion, ableitung);
  frameRate(10);
}

// Vollzieht einen einzelnen Schritt im Gradientenabstieg, wenn
// GUI.schrittButton gedrückt ist
function draw() {
  if (schrittButtonIstGedrueckt) {
    const lernrate = float(GUI.lernrateWaehler.value());
    xAktuell = schritt(xAktuell, lernrate);
  }
  GUI.zeichne(xAktuell, funktion, ableitung);
}

// Die urspüngliche Funktion
function funktion(x) { 
  return (0.0625 * x**4 - 0.75 * x**2 + 0.125 * x + 0.25);
}

// Die Ableitung der ursprünglichen Funktion
function ableitung(x) {
  return (0.25 * x**3 - 1.5 * x + 0.125);
}

// Callback-Funktion für GUI.xNeuButton.mousePressed()
function xNeu() {
  while(true) {
    xAktuell = random(-3.7, 3.7);
    const yAktuell = funktion(xAktuell);
    if (yAktuell > 0) {
      break;
    }
  }
  background(255);
  GUI.zeichneKoordinatensystemUndGraphen(funktion, ableitung);
  GUI.zeichne(xAktuell, funktion, ableitung);
}

// Callback-Funktion für GUI.schrittButton.mousePressed()
function schrittButtonGedrueckt() {
  schrittButtonIstGedrueckt = true;
}

// Callback-Funktion für GUI.schrittButton.mouseReleased()
function schrittButtonLosgelassen() {
  schrittButtonIstGedrueckt = false;
}

// Vollzieht einen einzelnen Schritt im Gradientenabstieg und liefert
// den neuen Wert für x.
function schritt(xAktuell, lernrate) {
  // Steigung der Tangente am Punkt x, y
  let steigung = ableitung(xAktuell);
  // Verschiebung von x ist die negative Steigung mal Lernrate
  const veraenderung = -steigung * lernrate;
  // Neuer Wert für x
  return xAktuell + veraenderung;
}