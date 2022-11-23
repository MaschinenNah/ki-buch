// Liefert die Summe aller Elemente eines Arrays
function summe(array){
  return array.reduce((summe, wert) => summe + wert);
}