// Erzeugt ein zweidimensionales Array mit nZeilen und nSpalten.
// wert ist undefined -> Matrix wird mit Nullen gefüllt.
// wert ist Funktion -> Matrix wird Rückgabewerten der Funktion gefüllt.
// sonst -> Matrix wird mit wert gefüllt.
function erzeugeMatrix(nZeilen, nSpalten, wert=0) {
  let matrix = [];
  for(let zeile =0; zeile<nZeilen; zeile++) {
    if (typeof(wert) != "function") {
      matrix[zeile] = new Array(nSpalten).fill(wert);
    } else {
      matrix[zeile] = new Array(nSpalten).fill();
      for (const idx in matrix[zeile]) {
        matrix[zeile][idx] = wert.call();
      }
    }
  }
  return matrix;
}

// Liefert ein Objekt, bei dem Schlüssel und Werte eines Arrays vertauscht
// wurden.
// Aus ["dies", "das", "jenes"] wird {dies: 0, das: 1, jenes: 2}.
function invertiereArray(obj) {
  let resultat = {}
  let eintraege = Object.entries(obj);
  resultat = eintraege.map((eintrag) => [eintrag[1], parseInt(eintrag[0])]);
  resultat = Object.fromEntries(resultat);
  return resultat;
}