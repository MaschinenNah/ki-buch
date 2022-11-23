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

// Liefert eine String-Darstellung einer Matrix
function matrixAlsString(matrix,
                         zeilentrenner="\n",
                         zeichentrenner=" "){
  let resultat = [];
  const anzahlZeilen = matrix.length;
  for (j=0; j<anzahlZeilen; j++){
    const zeileAlsString = matrix[j].join(zeichentrenner);
    resultat.push(zeileAlsString);
  }
  resultat = resultat.join(zeilentrenner);
  return resultat;
}