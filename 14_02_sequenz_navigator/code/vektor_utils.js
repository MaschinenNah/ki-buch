function vektorZuString(vektor, nachkommastellen) {
  const vektorWerteString = vektor.map( wert => wert.toFixed(nachkommastellen));
  return vektorWerteString.join(", ");
}

function stringZuVektor(vektorString) {
  const vektorWerteStringArray = vektorString.split(", ");
  const vektor = vektorWerteStringArray.map(wertString => parseFloat(wertString));
  return vektor;
}

function addiereVektoren(vektorA, vektorB) {
return vektorA.map((value, index) => value + vektorB[index]);
}

function summiereVektoren(vektoren) {
return vektoren.reduce((summe, vektor) => addiereVektoren(summe, vektor));
}

function subtrahiereVektoren(vektorA, vektorB) {
return vektorA.map((value, index) => value - vektorB[index]);
}

function teileVektor(vektor, skalar) {
return vektor.map(value => value / skalar);
}

function multipliziereVektor_(vektor, skalar) {
return vektor.map(value => value * skalar);
}

function skalarProdukt(vektorA, vektorB) {
resultat = 0;
for (let i = 0; i < vektorA.length; i++) {
  resultat += vektorA[i] * vektorB[i];
}
return resultat;
}

// Die Kosinus Ähnlichkeit zwischen zwei Vektoren ergibt sich aus dem Winkel
// den die beiden Vektoren einschließen. Ist der Winkel 0, ist die 
// Ählichkeit 1, die Vektoren gelten als identisch.
function kosinusAehnlichkeit(vektorA, vektorB) {
  let skalarProdukt_ = skalarProdukt(vektorA, vektorB);
  let betragA = 0;
  let betragB = 0;

  for (let i = 0; i < vektorA.length; i++) {
    betragA += vektorA[i] * vektorA[i];
    betragB += vektorB[i] * vektorB[i];
  }

  betragA = Math.sqrt(betragA);
  betragB = Math.sqrt(betragB);

  if (betragA == 0 || betragB == 0) {
    return 0;
  }

  const aehlichkeit = skalarProdukt_ / (betragA * betragB);

  return aehlichkeit;
}

// Liefert ausgehend von sequenzVektoren eine Funktion, die Vektoren so 
// normalisiert, dass sie zwischen min_ und max_ liegen.
// TODO: ist sehr speziell auf die Klasse Sequenzeinbettung zugeschnitten
// und ist dort wahrscheinlich besser aufgehoben?!
function erzeugeNormalisierer(sequenzVektoren, min_, max_) {
  let kleinster = Infinity;
  let groesster = -Infinity;
  
  for (let sequenzVektor of sequenzVektoren) {
    for (let value of sequenzVektor.vektor) {
      kleinster = Math.min(kleinster, value);
      groesster = Math.max(groesster, value);
    }
  }
  
  return function normalisiere(vektor) {
    return vektor.map(value => ((value - kleinster) / (groesster - kleinster)) * (max_ - min_) + min_);
  };
}


// Kann weg?!
/* function normalisiereVektoren(sequenzVektoren, min_, max_) {
  let kleinster = Infinity;
  let groesster = -Infinity;
  
  for (let sequenzVektor of sequenzVektoren) {
    for (let value of sequenzVektor.vektor) {
      kleinster = Math.min(kleinster, value);
      groesster = Math.max(groesster, value);
    }
  }
  
  for (let sequenzVektor of sequenzVektoren) {
    sequenzVektor.vektor = sequenzVektor.vektor.map(value => ((value - kleinster) / (groesster - kleinster)) * (max_ - min_) + min_);
  }
} */
  