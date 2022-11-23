// Funktionen, die Aufgaben für den Neuronentrainer
// bereitstellen. Eine Aufgabe ist immer ein PGraphics-Objekt (also schlicht 
// gesagt ein Bild) mit 100 x 100 Pixeln. Jedes Pixel codiert eine
// Klasse.
// Der Konstruktor des Datengenerators (siehe unten...) erwartet ein
// Farbschema und eine dieser Funktionen als Argument.

const farbschema = [[200,0,0],
                    [0,0,200],
                    [0,150,0],
                    [128,0,255],
                    [255,140,0],
                    [0,128,255],
                    [0,255,128]];


function zweiStreifen(farbschema) {
  const bild = createGraphics(100, 100);
  bild.noStroke();
  bild.fill(farbschema[0]);
  bild.rect(0, 0, 50, 100);
  bild.fill(farbschema[1]);
  bild.rect(50, 0, 50, 100);
  return {bild: bild,
          nFarben: 2};
}

function dreiStreifenDreiFarben(farbschema) {
  const bild = createGraphics(100, 100);
  bild.noStroke();
  bild.fill(farbschema[0]);
  bild.rect(0, 0, 33, 100);
  bild.fill(farbschema[1]);
  bild.rect(33, 0, 33, 100);
  bild.fill(farbschema[2]);
  bild.rect(66, 0, 34, 100);
  return {bild: bild,
          nFarben: 3};
}

function dreiStreifenZweiFarben(farbschema) {
  const bild = createGraphics(100, 100);
  bild.noStroke();
  bild.fill(farbschema[0]);
  bild.rect(0, 0, 33, 100);
  bild.fill(farbschema[1]);
  bild.rect(33, 0, 33, 100);
  bild.fill(farbschema[0]);
  bild.rect(66, 0, 34, 100);
  return {bild: bild,
          nFarben: 2};
}

function sechsStreifenSechsFarben(farbschema) {
  const bild = createGraphics(100, 100);
  bild.noStroke();
  bild.fill(farbschema[0]);
  bild.rect(0, 0, 17, 100);
  bild.fill(farbschema[1]);
  bild.rect(17, 0, 17, 100);
  bild.fill(farbschema[2]);
  bild.rect(34, 0, 17, 100);
  bild.fill(farbschema[3]);
  bild.rect(51, 0, 17, 100);
  bild.fill(farbschema[4]);
  bild.rect(68, 0, 17, 100);
  bild.fill(farbschema[5]);
  bild.rect(85, 0, 15, 100);

  return {bild: bild,
          nFarben: 6};
}


function sechsStreifenZweiFarben(farbschema) {
  const bild = createGraphics(100, 100);
  bild.noStroke();
  bild.fill(farbschema[0]);
  bild.rect(0, 0, 17, 100);
  bild.fill(farbschema[1]);
  bild.rect(17, 0, 17, 100);
  bild.fill(farbschema[0]);
  bild.rect(34, 0, 17, 100);
  bild.fill(farbschema[1]);
  bild.rect(51, 0, 17, 100);
  bild.fill(farbschema[0]);
  bild.rect(68, 0, 17, 100);
  bild.fill(farbschema[1]);
  bild.rect(85, 0, 15, 100);

  return {bild: bild,
          nFarben: 2};
}

function kachelungVierFarben2x2(farbschema) {
  const bild = createGraphics(100, 100);
  bild.noStroke();
  bild.fill(farbschema[0]);
  bild.rect(0, 0, 50);
  bild.fill(farbschema[1]);
  bild.rect(50, 0, 50);
  bild.fill(farbschema[2]);
  bild.rect(0, 50, 50);
  bild.fill(farbschema[3]);
  bild.rect(50, 50, 50);
  return {bild: bild,
          nFarben: 4};
}

function kachelungZweiFarben2x2(farbschema) {
  const bild = createGraphics(100, 100);
  bild.noStroke();
  bild.fill(farbschema[0]);
  bild.rect(0, 0, 50);
  bild.fill(farbschema[1]);
  bild.rect(50, 0, 50);
  bild.fill(farbschema[0]);
  bild.rect(0, 50, 50);
  bild.fill(farbschema[1]);
  bild.rect(50, 50, 50);
  return {bild: bild,
          nFarben: 2};

}

function kachelungVierFarben3x3(farbschema) {
  const dKachel = 34;
  let farbNr = 0;
  const bild = createGraphics(100, 100);
  bild.noStroke();
  for (let x = 0; x < 100; x+=dKachel) {
    for (let y = 0; y < 100; y+=dKachel) {
      farbNr = (farbNr += 1) % 4;
      const farbArray = farbschema[farbNr];
      bild.fill(farbArray);
      bild.rect(x, y, dKachel, dKachel);
    }
  }
  return {bild: bild,
    nFarben: 4};
}

function kachelungZweiFarben3x3(farbschema) {
  const dKachel = 34;
  let farbNr = 0;
  const bild = createGraphics(100, 100);
  bild.noStroke();
  for (let x = 0; x < 100; x+=dKachel) {
    for (let y = 0; y < 100; y+=dKachel) {
      farbNr = (farbNr += 1) % 2;
      const farbArray = farbschema[farbNr];
      bild.fill(farbArray);
      bild.rect(x, y, dKachel, dKachel);
    }
  }
  return {bild: bild,
    nFarben: 4};
}

function kreisUndHintergrund(farbschema) {
  const bild = createGraphics(100, 100);
  bild.background(farbschema[0]);
  bild.noStroke();
  bild.fill(farbschema[1]);
  bild.ellipse(50, 50, 75);
  return {bild: bild,
          nFarben: 2};
}

function quadratUndHintergrund(farbschema) {
  const bild = createGraphics(100, 100);
  bild.background(farbschema[0]);
  bild.noStroke();
  bild.fill(farbschema[1]);
  bild.rectMode(CENTER);
  bild.rect(50, 50, 60);
  return {bild: bild,
          nFarben: 2};
}

function farbtunnelDreiFarben(farbschema) {
  const bild = createGraphics(100, 100);
  bild.noStroke();
  bild.fill(farbschema[0]);
  bild.rect(0, 0, 100);
  bild.fill(farbschema[1]);
  bild.rect(15, 15, 70);
  bild.fill(farbschema[2]);
  bild.rect(30, 30, 40);
  return {bild: bild,
          nFarben: 3};
}

function farbtunnelSiebenFarben(farbschema) {
  const bild = createGraphics(100, 100);
  bild.noStroke();
  bild.fill(farbschema[0]);
  bild.rect(0, 0, 100);
  bild.fill(farbschema[1]);
  bild.rect(10, 10, 80);
  bild.fill(farbschema[2]);
  bild.rect(20, 20, 60);
  bild.fill(farbschema[3]);
  bild.rect(40, 0, 20, 100);
  bild.fill(farbschema[4]);
  bild.rect(0, 40, 100, 20);
  bild.fill(farbschema[5]);
  bild.rectMode(CENTER);
  bild.rect(50, 50, 40, 40);
  bild.fill(farbschema[6]);
  bild.rect(50, 50, 20, 20);
  return {bild: bild,
          nFarben: 7};
}

function waagerechtSenkrechtSechsFarben(farbschema) {
  const bild = createGraphics(100, 100);
  bild.noStroke();
  bild.fill(farbschema[0]);
  bild.rect(0, 0, 17, 100);
  bild.fill(farbschema[1]);
  bild.rect(17, 0, 17, 100);
  bild.fill(farbschema[2]);
  bild.rect(34, 0, 17, 100);
  bild.fill(farbschema[3]);
  bild.rect(51, 0, 49, 33);
  bild.fill(farbschema[4]);
  bild.rect(51, 33, 49, 33);
  bild.fill(farbschema[5]);
  bild.rect(51, 66, 49, 34);


  return {bild: bild,
          nFarben: 6};
}


// Objekte dieser Klasse stellen das Bild und Trainings- sowie
// Validierungsdaten zu einer Aufgabe bereit
class DatenGenerator {

  constructor(farbschema, bildErzeuger) {
    const bildErzeugerAusgabe = bildErzeuger(farbschema);
    this.nKlassen = bildErzeugerAusgabe.nFarben;
    this.farbschema = farbschema.slice(0, this.nKlassen);
    this.bild = bildErzeugerAusgabe.bild;
  }

  // Schnittstelle: Zeichnet das Aufgabenbild
  zeichneBild(xPos, yPos, breite, hoehe) {
    image(this.bild, xPos, yPos, breite, hoehe);
  }
  
  // Schnittstelle: Erzeugt n Beispiele zum Training und zur Validierung
  erzeugeBeispiele(nBeispiele) {
    const resultat = [];
    while (resultat.length < nBeispiele) {
      const x = random();
      const y = random();
      const farbArray = this.bild.get(x*100, y*100).slice(0,3);
      const klassenArray = this.farbArrayZuKlassenArray(farbArray);
      if (klassenArray == undefined) {
        continue;
      }
      const beispiel = {eingabe: [x, y],
                        ausgabe: klassenArray }
      resultat.push(beispiel)
    }
    return resultat;
  }

  // Diverse Übersetzungen...
  klassenNrZuKlassenArray(klassenNr) {
    let resultat = new Array(this.nKlassen).fill(0);
    resultat[klassenNr] = 1;
    return resultat;
  }

  klassenArrayZuKlassenNr(klassenArray) {
    return maxPos(klassenArray);
  }

  klassenNrZuFarbArray(klassenNr) {
    return this.farbschema[klassenNr];
  }

  klassenArrayZuFarbArray(klassenArray) {
    const klassenNr =  this.klassenArrayZuKlassenNr(klassenArray);
    return this.klassenNrZuFarbArray(klassenNr);
  }  

  farbArrayZuKlassenArray(farbArray) {
    for (let klassenNr in this.farbschema) {
      const farbArray2 = this.farbschema[klassenNr];
      if (JSON.stringify(farbArray) == JSON.stringify(farbArray2)) {
        return this.klassenNrZuKlassenArray(klassenNr);
      }
    }
  }

}