// Liefert die Summe aller Elemente eines Arrays
function summe(array) {
  return array.reduce((summe, wert) => summe + wert);
}

// Liefert den Mittelwert aller Elemente eines Arrays
function mittelwert(array) {
  return summe(array) / array.length;
}

// Liefert auf Basis eines Arrays ein Objekt, bei dem Schlüssel und Werte
// vertauscht wurden.
// Aus ["dies", "das", "jenes"] wird {dies: 0, das: 1, jenes: 2}.
function invertiereDict(array) {
  let invertiere = {};
  for (let key in array) {
      invertiere[array[key]] = key;
  }
  return invertiere;
}

// Liefert auf Basis eines Objekts, dessen Werte numerisch sind,
// ein neues Objekt, bei dem die Werte auf den Wertebereich min_ bis max_
// skaliert wurden.
function skaliereWerte(dict, min_, max_) {
  let currentMin = Infinity;
  let currentMax = -Infinity;

  for (let key in dict) {
      for (let i = 0; i < dict[key].length; i++) {
          currentMin = Math.min(currentMin, dict[key][i]);
          currentMax = Math.max(currentMax, dict[key][i]);
      }
  }

  let skaliertesDict = {};
  for (let key in dict) {
      skaliertesDict[key] = dict[key].map(value => min_ + (value - currentMin) 
                            * (max_ - min_) / (currentMax - currentMin));
  }

  return skaliertesDict;
}

// Liefert auf Basis eines Arrays ein neues Array, bei dem die Reihenfolge
// der Elemente vermischt wurden.
function mischeArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];  // Vertauschen der Elemente
  }
  return array;
}

// Liefert auf Basis eines Objektes ein neues Objekt, bei dem die Reihenfolge
// der Schlüssel vermischt wurden.
function mischeObjekt(obj) {
  const keys = mischeArray(Object.keys(obj));
  const shuffledObj = {};

  keys.forEach(key => {
      shuffledObj[key] = obj[key];
  });

  return shuffledObj;
}

// Liefert das letzte Zeichen in einem String
function letztesZeichen(string){
  return string[string.length-1];
}

// ...in dem alle Leerzeichen vor Satzzeichen entfernt wurden
function entferneLeerzeichenVorSatzzeichen(string){
  string = string.replaceAll(/\s+[\.\?:,!]/g, letztesZeichen);
  return string
}

// Liefert das erste Element von Array, das eigenschaft erfüllt,
// sonst undefined
function findeErstenTreffer(array, eigenschaft) {
  const trefferIndex = array.findIndex(eigenschaft);

  if (trefferIndex !== -1) {
      return array[trefferIndex];
  }
}

// Entfernt das erste Element von Array, das eigenschaft erfüllt.
function entferneErstenTreffer(array, eigenschaft) {
  const trefferIndex = array.findIndex(eigenschaft);

  if (trefferIndex !== -1) {
    array.splice(trefferIndex, 1);
  }

  return array;
}


// Diese Funktionen sind nötig, weil loadJSON und loadStrings kein Promise
// liefert
function loadJSONPromise(url) {
  return new Promise((resolve, reject) => {
    loadJSON(url, data => resolve(data), err => reject(err));
  });
}

function loadStringPromise(url) {
  return new Promise((resolve, reject) => {
    loadStrings(url, data => resolve(data), err => reject(err));
  });
}
