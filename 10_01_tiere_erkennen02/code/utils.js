// Liefert die Position des maximalen Elements bzw. undefined, wenn es
// keinen "Spitzenreiter" gibt (wenn doppelteErlauben false ist)
function maxPos(array, doppelteErlauben=true){
  const maxWert = Math.max(...array);
  let maxWerte = array.filter(wert => wert == maxWert);
  if (doppelteErlauben || maxWerte.length == 1) {
    return array.indexOf(maxWert);
  }
}