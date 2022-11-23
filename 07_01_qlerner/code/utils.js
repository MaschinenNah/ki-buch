// Erzeugt ein zweidimensionales Array mit nZeilen und nSpalten.
// wert ist undefined --> Matrix wird mit Nullen gefüllt.
// wert ist Funktion --> Matrix wird Rückgabewerten der Funktion gefüllt.
// sonst --> Matrix wird mit wert gefüllt.
function erzeugeMatrix(nZeilen, nSpalten, wert) {
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

// Liefert true, wenn alle Werte in array identisch sind
function alleGleich(array) {
  return array.every( v => v === array[0]);
}

// Liefert die Position des maximalen Elements bzw. undefined, wenn es
// keinen "Spitzenreiter" gibt (wenn doppelteErlauben false ist)
function maxPos(array, doppelteErlauben=true){
  const maxWert = Math.max(...array);
  let maxWerte = array.filter(wert => wert == maxWert);
  if (doppelteErlauben || maxWerte.length == 1) {
    return array.indexOf(maxWert);
  }
}