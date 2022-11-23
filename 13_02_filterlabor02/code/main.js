let bildVorher;
let bildNachher;

function setup(){
  GUI.erzeugeGUI();
  bildVorher = new Zeichen();
  noSmooth();
  frameRate(1);
  zeichenGewaehlt();
  aktualisiereUndZeichne();
}

// Callback-Funktion für GUI.zeichenWaehler.changed()
function zeichenGewaehlt() {
  bildVorher.rendereZeichen(GUI.zeichenWaehler.value());
  aktualisiereUndZeichne();
}

// Wendet Filterketten an und zeichnet das Ergebnis
function aktualisiereUndZeichne() {
  const bildArray01 = filterKette(bildVorher, 9);
  const bildArray02 = filterKette(bildVorher, 9);
  const bildArray03 = filterKette(bildVorher, 9);
  const bildArray04 = filterKette(bildVorher, 9);
  const bildArray05 = filterKette(bildVorher, 9);
  const bildArray06 = filterKette(bildVorher, 9);
  GUI.zeichne(bildVorher, bildArray01, 
                          bildArray02, 
                          bildArray03, 
                          bildArray04, 
                          bildArray05,
                          bildArray06);
}

// Schickt ein Bild durch eine zufällig generierte Filterkette und liefert
// das Ergebnis als Array mit Bildern
function filterKette(bildVorher, nFilter) {
  const resultat = [];
  const derFilter = new Filter();
  let gefiltertesBild = bildVorher;

  for (let i = 1; i <= nFilter; i++) {
    derFilter.zufallsKernel();
    gefiltertesBild = derFilter.filterAnwenden(gefiltertesBild, 2);
    resultat.push(gefiltertesBild);
  }
  return resultat;
}