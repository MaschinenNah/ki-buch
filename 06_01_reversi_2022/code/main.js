let spielzustand;
let ki;
let kiAlphaBeta;
let timer;


function setup(){
  GUI.erzeugeGUI();
  ki = new KI();
  kiAlphaBeta = new KIAlphaBeta();
  neuesSpiel();
}

// Mausklick löst zugMensch aus, sofern der Mensch dran ist
function mousePressed() {
  if(spielzustand.spieler == -1) {
    zugMensch();
  }
}

// Callback-Funktion, die nach jedem Zug per Timeout aufgerufen wird.
// Sie stößt einen Zug der KI an, sofern diese dran ist.
function aktualisiere() {
  if (spielzustand.spieler == 1) {
    zugMaschine();
  }
}

function zugMensch() {
  const zugKoord = GUI.mausPositionZuZelle(mouseX, mouseY, spielzustand);
  const neuerSpielzustand = spielzustand.zug(zugKoord);

  if (neuerSpielzustand) {
    spielzustand = neuerSpielzustand;
    console.log("Mensch zieht", zugKoord[0], zugKoord[1]);
    GUI.zeichne(spielzustand);
    setTimeout(aktualisiere, 250);
  }
}

function zugMaschine() {
  nSpielzustaende = 0;
  const suchtiefe = int(GUI.suchtiefeWaehler.value());
  let besterZug;

  if (GUI.alphaBetaCheckbox.checked()) {
    besterZug = kiAlphaBeta.minimax(spielzustand, suchtiefe).besterZug;
  } else {
    besterZug = ki.minimax(spielzustand, suchtiefe).besterZug;
  }

  console.log("Maschine zieht", besterZug[0], besterZug[1]);
  spielzustand = spielzustand.zug(besterZug);
  GUI.zeichne(spielzustand);
  setTimeout(aktualisiere, 250);
}

// Callback-Funktion für GUI.neuesSpielButton.mousePressed()
function neuesSpiel() {
  spielzustand = new Spielzustand();
  GUI.zeichne(spielzustand);
}