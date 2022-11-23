let umwelt;
let qLerner;

function setup(){
  umwelt = new Umwelt();
  GUI.erzeugeGUI();
  neuerQLerner();
  frameRate(16);
}

function draw() {
  umwelt = qLerner.schritt(umwelt);
  GUI.zeichne(umwelt, qLerner);
}

// Callback-Funktion für GUI-Element neuerQLernerButton
function neuerQLerner() {
  umwelt.initialisiereAgent();
  qLerner = new QLerner(umwelt);
  umwelt.nEpisoden = 0;
  epsilonGewaehlt();
  gammaGewaehlt();
  GUI.zeichne(umwelt, qLerner);
}

// Callback-Funktion für GUI-Element pauseButton
function pause_() {
  if (isLooping()) {
    noLoop();
  } else {
    loop();
  }
}

// Callback-Funktion für GUI-Element turboSchrittButton
function turboSchritt() {
  for (let i=0; i<5000; i++) {
    umwelt = qLerner.schritt(umwelt);
  }
  GUI.zeichne(umwelt, qLerner);
}

// Callback-Funktion für GUI-Element gammaWaehler
function gammaGewaehlt() {
  qLerner.gamma = float(GUI.gammaWaehler.value());
}

// Callback-Funktion für GUI-Element epsilonWaehler
function epsilonGewaehlt() {
  qLerner.epsilon = float(GUI.epsilonWaehler.value());
}

// Callback-Funktion für GUI-Element speedWaehler
function geschwGewaehlt() {
  frameRate(int(GUI.speedWaehler.value()));
}

// Mausklicks abfangen und ggf. Zustandsbericht in GUI-Element 
// textMonitor schreiben
function mousePressed() {
  if (GUI.mausImSpielfeld(mouseX, mouseY)) {
    const koord = GUI.mausPositionZuZelle(mouseX, mouseY);
    const zustandsNr = umwelt.koordinateNachZustandsNr(koord.zeile, koord.spalte);
    const zelleAlsString = GUI.zelleAlsString(qLerner,
      koord.zeile,
      koord.spalte,
      zustandsNr);
    GUI.textMonitor.html(zelleAlsString);
  }
}

// Neuzeichnen nach Mausklicks
function mouseReleased() {
  GUI.zeichne(umwelt, qLerner);
}