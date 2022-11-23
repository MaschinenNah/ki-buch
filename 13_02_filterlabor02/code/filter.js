class Filter {

  constructor() {
    this.kernel = [0,0,0,0,1,0,0,0,0];

    // Die für eine zufällige Auswahl zur Verfügung stehenden Kernel
    this.alleKernel = [
      [1, 0, -1, 1, 0, -1, 1, 0, -1],
      [-1, 0, 1, -1, 0, 1, -1, 0, 1],
      [1, 1, 1, 0, 0, 0, -1, -1, -1],
      [-1, -1, -1, 0, 0, 0, 1, 1, 1],
      [1, 2, 1, 0, 0, 0, -1, -2, -1],
      [1, 0, -1, 2, 0, -2, 1, 0, -1],
      [0, -1, 0, -1, 5, -1 ,0, -1, 0],
      [1, 2, 1, 2, -12, 2, 1, 2, 1],
      [0, 1, 0, 1, -4, 1, 0, 1, 0],
      [1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, -1, 2, 0, -2, 1, 0, -1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 2, 1, 0, 0, 0, -1, -2, -1],
      [0, 1, 0, 1, -4, 1, 0, 1, 0]
    ];
  }

  // Wählt einen zufälligen Kernel
  zufallsKernel() {
    this.kernel = random(this.alleKernel);
  }

  // Wendet einen Filterkernel auf ein Objekt der Hilfsklasse Bild an 
  // und liefert das Ergebnis als Bild-Objekt
  filterAnwenden(bild, schrittweite=1) {
    let filterSumme = summe(this.kernel);
    if (filterSumme == 0) {
      filterSumme = 1;
    }
    const pImageVorher = bild.pImage;
    const breiteEin = pImageVorher.width;
    const hoeheEin = pImageVorher.height;
    const breiteAus = ceil(breiteEin / schrittweite);
    const hoeheAus = ceil(hoeheEin / schrittweite);
    const pImageNachher = createImage(breiteAus, hoeheAus);
    
    pImageVorher.loadPixels();
    pImageNachher.loadPixels();
    const pixelsVorher = pImageVorher.pixels;
    const pixelsNachher = pImageNachher.pixels;

    // Hier läuft der Filterkernel über das Bild...
    for (let xEin = 0; xEin < breiteEin; xEin+=schrittweite) {
      for (let yEin = 0; yEin < hoeheEin; yEin+=schrittweite) {
        const ausschnitt = bildauschnitt(xEin, yEin);
        let farbe = this.multipliziereUndAddiereArrays(ausschnitt, this.kernel);
        farbe = farbe/filterSumme;
        const xAus = floor(xEin / schrittweite);
        const yAus = floor(yEin / schrittweite);
        const position = ((yAus * breiteAus + xAus) * 4);
        pixelsNachher[position] = farbe;
        pixelsNachher[position + 1] = farbe;
        pixelsNachher[position + 2] = farbe;
        pixelsNachher[position + 3] = 255;
      }
    }
    const resultat = new Zeichen();
    resultat.pImage = pImageNachher;

    // Liefert einen Bildausschnitt 3x3 mit dem gegebeben Mittelpunkt als
    // eindimensionales Array
    function bildauschnitt(xMitte, yMitte) {
      const resultat = [];
      
      for (let y = yMitte-1; y < yMitte+2; y++) {
        for (let x = xMitte-1; x < xMitte+2; x++) {
          if (x < 0 || x >= breiteEin || y < 0 || y >= hoeheEin) {
            resultat.push(0);
          } else {
            const pixelsIdx = (y * breiteEin + x) * 4;
            resultat.push(pixelsVorher[pixelsIdx]);
          }
        }
      }
      return resultat;
    }
    pImageNachher.updatePixels();
    return resultat;
  }
  
  // Multipliziert zwei Arrays elementweise miteinander und bildet 
  // die Summe
  multipliziereUndAddiereArrays(arr1, arr2) {
    let resultat = 0;
    for (let idx in arr1) {
      resultat += (arr1[idx] * arr2[idx]);
    }
    return resultat;
  }

}