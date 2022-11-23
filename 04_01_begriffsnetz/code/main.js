let transaktionsStrings;
let begriffsnetz;

// Lädt die transaktionsStrings vor Aufruf von setup
function preload(){
  transaktionsStrings = loadStrings("daten/absaetze.txt");
}

function setup(){
  GUI.erzeugeGUI();
  begriffsnetz = new Begriffsnetz(transaktionsStrings);
  zufaelligesItem();
}

// Callback-Funktion für GUI.itemButtons.mousePressed()
function itemButtonKlick() {
  const itemId = this.value();
  const itemString = begriffsnetz.itemStrings[itemId];
  GUI.erzeugeItemButtonA(itemString, itemId);

  const assoziationen = begriffsnetz.assoziationen(itemId,
                          GUI.matrixWaehler.value(),
                          GUI.nAssoziationenWaehler.value());
  
  GUI.erzeugeItemButtonsB(assoziationen);
}

// Callback-Funktion für GUI.transaktionsWaehler.changed()
function transaktionsdateiGeaendert() {
  const transaktionsdatei = GUI.transaktionsWaehler.value();
  loadStrings(transaktionsdatei, transaktionsdateiGeladen);
}

// Callback-Funktion, die nach dem erfolgreichen Laden der
// Transaktionsdatei ausgeführt wird
function transaktionsdateiGeladen(transaktionsStrings) {
  begriffsnetz = new Begriffsnetz(transaktionsStrings);
  zufaelligesItem();
}

// Callback-Funktion für GUI.matrixWaehler.changed() und 
// GUI.nAssoziationenWaehler.changed()
function parameterGeaendert(){
  itemButtonKlick.bind(GUI.itemButtonA)();
}

// Callback-Funktion für GUI.zufallsButton.mousePressed()
function zufaelligesItem(){
  const itemString = random(begriffsnetz.itemStrings);
  const itemId = begriffsnetz.itemStringToId[itemString];
  GUI.erzeugeItemButtonA(itemString, itemId);
  itemButtonKlick.bind(GUI.itemButtonA)();
}