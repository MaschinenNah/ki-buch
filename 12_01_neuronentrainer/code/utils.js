// Liefert die Position des maximalen Elements bzw. undefined, wenn es
// keinen "Spitzenreiter" gibt (wenn doppelteErlauben false ist)
function maxPos(array, doppelteErlauben=true){
  const maxWert = Math.max(...array);
  let maxWerte = array.filter(wert => wert == maxWert);
  if (doppelteErlauben || maxWerte.length == 1) {
    return array.indexOf(maxWert);
  }
}

// Diese Funktion "staucht" array auf die maximaleLaenge, falls es
// diese überschreitet. In dem Fall wird array in maximaleLaenge Scheiben
// (Chunks) zerlegt, und der Mittelwert einer jeden Scheibe berechnet.
// Der Rückgabewert ist ein Array mit den Mittelwerten.
function stauchen(array, maximaleLaenge) {
  const laenge = array.length 
  if (laenge <= maximaleLaenge) {
    return array;
  }
  const schritt = Math.floor(laenge/maximaleLaenge)+1;
  const scheiben = [];
  for (let idx = 0; idx < laenge; idx+=schritt) {
    scheiben.push(array.slice(idx, idx+schritt))
  }
  const resultat = [];
  for (let scheibe of scheiben) {
    let betrag = 0;
    for (let element of scheibe) {
      betrag += element;
    }
    resultat.push(betrag / scheibe.length);
  }
  return resultat;
}

// Hilfsklasse zur Darstellung von PGraphics und PImage Objekten
class BildPlotter {

  constructor(beschriftung, 
              bereichX, 
              bereichY, 
              bereichBreite, 
              bereichHoehe) {
    this.bereichX = bereichX;
    this.bereichY = bereichY;
    this.bereichBreite = bereichBreite;
    this.bereichHoehe = bereichHoehe;
    this.schriftHoehe = 15;
    this.beschriftung = beschriftung;
    this.dRand = 5;
  }

  zuruecksetzen() {
    push();
    fill(220);
    noStroke();
    rect(this.bereichX,
         this.bereichY, 
         this.bereichBreite, 
         this.bereichHoehe);
    
    noStroke();
    fill(0);
    textSize(12.5);
    text(this.beschriftung,
         this.bereichX+this.dRand,
         this.bereichY+this.bereichHoehe-this.schriftHoehe+2*this.dRand);
     
    pop();
  }

  zeichneBild(bild) {
    image(bild, this.bereichX+this.dRand,
                this.bereichY+this.dRand,
                this.bereichBreite-2*this.dRand,
                this.bereichHoehe-this.dRand-this.schriftHoehe);
  }

}

// Hilfsklasse zur Darstellung von Arrays
class ArrayPlotter {

  constructor(beschriftung,
              bereichX, 
              bereichY, 
              bereichBreite, 
              bereichHoehe) {
    this.bereichX = bereichX;
    this.bereichY = bereichY;
    this.bereichBreite = bereichBreite;
    this.bereichHoehe = bereichHoehe;
    this.xMin = -1;
    this.xMax = 1;
    this.yMin = 0;
    this.yMax = 1;
    this.schriftHoehe = 15;
    this.beschriftung = beschriftung;
    this.dRand = 5;
    this.zuruecksetzen();
  }

  setzeDarstellungsbereich(yMin, yMax) {
    this.yMin = yMin;
    this.yMax = yMax;
    this.zuruecksetzen();
  }

  zuruecksetzen() {
    push();
    fill(220);
    noStroke();
    rect(this.bereichX, this.bereichY, this.bereichBreite, this.bereichHoehe);
    fill(255);
    rect(this.bereichX + this.dRand,
         this.bereichY + this.dRand,
         this.bereichBreite -2*this.dRand,
         this.bereichHoehe -this.schriftHoehe-this.dRand);

    noStroke();
    fill(0);
    textSize(12.5);
    text(this.beschriftung,
         this.bereichX+this.dRand, 
         this.bereichY+this.bereichHoehe-this.schriftHoehe+2*this.dRand);
     
    pop();
  }

  uebersetzeX(x) {
    return map(x,
               this.xMin,
               this.xMax,
               this.bereichX+this.dRand,
               this.bereichX+this.bereichBreite-this.dRand);
  }

  uebersetzeY(y) {
    return map(y,
               this.yMin,
               this.yMax,
               this.bereichY+this.bereichHoehe-this.schriftHoehe-this.dRand,
               this.bereichY+this.dRand);
  }

  zeichneArray(array, yMin, yMax) {
    this.xMin = 0;
    this.xMax = array.length;
    if(yMin != undefined) {
      this.yMin = yMin
    } else {
      this.yMin = min(array);
    }
    if(yMax != undefined) {
      this.yMax = yMax
    } else {
      this.yMax = max(array);
    }
    const arrayGestaucht = stauchen(array, 200);
    const nWerte = arrayGestaucht.length;
    const schritt = 1;

    for (let idx = 0; idx < nWerte-schritt-1; idx+= schritt) {
      const xPlot = map(idx, 
                        0,
                        nWerte-schritt-1,
                        this.bereichX+this.dRand,
                        this.bereichX+this.bereichBreite - this.dRand);
      const yPlot = map(arrayGestaucht[idx],
                        this.yMin,
                        this.yMax,
                        this.bereichY + this.bereichHoehe - this.schriftHoehe-this.dRand,
                        this.bereichY + this.dRand);
      const xPlot2 = map(idx+schritt,
                         0,
                         nWerte-schritt-1,
                         this.bereichX + this.dRand,
                         this.bereichX + this.bereichBreite - this.dRand);

      const yPlot2 = map(arrayGestaucht[idx+schritt],
                         this.yMin,
                         this.yMax,
                         this.bereichY + this.bereichHoehe - this.schriftHoehe-this.dRand,
                         this.bereichY + this.dRand);
      line(xPlot, yPlot, xPlot2, yPlot2);
    }
  }
}
