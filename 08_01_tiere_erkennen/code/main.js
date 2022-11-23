let knn;

function preload() {
  GUI.ladeSprites();
}

function setup(){
  knn = new KNN(datenpunkte);
  GUI.erzeugeGUI();
  GUI.zeichneDatenpunkte(knn.datenpunkte);
}

function mousePressed() {
  if (GUI.mausIstImSpielfeld()) {
    background(220);
    const datenpunktA = GUI.mausPositionZuDatenpunkt();
    const k = GUI.kWaehler.value();
    const nachbarn = knn.nachbarn(datenpunktA, k);
    knn.klassifiziere(datenpunktA, k);
    GUI.zeichneNachbarschaft(datenpunktA, nachbarn);
    GUI.zeichneDatenpunkte(knn.datenpunkte);
  }
}