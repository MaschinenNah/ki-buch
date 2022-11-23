let kMeans;

function setup() {
  kMeans = new KMeansClustering(datenpunkte, 4);
  GUI.erzeugeGUI();
  GUI.zeichne(kMeans);
}

// Callback-Funktion für GUI.kWaehler.changed()
function kGewaehlt() {
  kMeans = new KMeansClustering(datenpunkte, parseInt((GUI.kWaehler.value())));
  GUI.zeichne(kMeans);
}

// Callback-Funktionen für die vier Buttons in der GUI
function zentrenNeuBerechnen() {
  kMeans.zentrenNeuBerechnen();
}

function datenpunkteZuordnen() {
  kMeans.datenpunkteZuordnen();
}

function schritt() {
  kMeans.datenpunkteZuordnen();
  kMeans.zentrenNeuBerechnen();
}

function zentrenZufaelligSetzen() {
  kMeans.zentrenZufaelligSetzen();
  kMeans.datenpunkteZuordnen();
}

function mouseReleased() {
  GUI.zeichne(kMeans);
}