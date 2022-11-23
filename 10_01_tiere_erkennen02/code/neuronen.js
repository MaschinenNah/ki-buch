// Vier Funktionen, welche die vier Neuronen modellieren.
// Ausführliche Erläuterung siehe Kapitel 10.

function istHaeschen(flauschigkeit, niedlichkeit) {
  const gewicht01 = 1;
  const gewicht02 = 1;
  const bias = -1;
  let resultat = flauschigkeit * gewicht01 +
                 niedlichkeit * gewicht02 + 
                 bias;
  resultat = aktivierungsfunktion(resultat);  
  return resultat;
}

function istIgel(flauschigkeit, niedlichkeit) {
  const gewicht01 = -1.0;
  const gewicht02 = 1.0;
  const bias = 0;
  let resultat = flauschigkeit * gewicht01 +
                 niedlichkeit * gewicht02 + 
                 bias;
  resultat = aktivierungsfunktion(resultat);
  return resultat;
}

function istVogelspinne(flauschigkeit, niedlichkeit) {
  const gewicht01 = 1.0;
  const gewicht02 = -1.0;
  const bias = 0;
  let resultat = flauschigkeit * gewicht01 +
                 niedlichkeit * gewicht02 + 
                 bias;
  resultat = aktivierungsfunktion(resultat);
  return resultat;
}

function istHai(flauschigkeit, niedlichkeit) {
  const gewicht01 = -1.0;
  const gewicht02 = -1.0;
  const bias = 1;
  let resultat = flauschigkeit * gewicht01 +
                 niedlichkeit * gewicht02 + 
                 bias;
  resultat = aktivierungsfunktion(resultat);
  return resultat;
}

function aktivierungsfunktion(wert) {
  return max(0, wert);
}