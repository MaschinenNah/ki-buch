class Filter {

  constructor() {
    // Der Kernel wird hier als eindimensionales Array repräsentiert
    this.kernel = [0,0,0,0,0,0,0,0,0];
  }

  ladeKernel(kernel) {
    this.kernel = kernel;
  }

  // Wendet einen Filterkernel auf ein Objekt der Hilfsklasse Bild an 
  // und liefert das Ergebnis als Bild-Objekt
  filterAnwenden(bild) {
    let filterSumme = summe(this.kernel);
    if (filterSumme == 0) {
      filterSumme = 1;
    }
    const pImageVorher = bild.pImage;
    const breite = pImageVorher.width;
    const hoehe = pImageVorher.height;
    const pImageNachher = createImage(breite, hoehe);
    pImageVorher.loadPixels();
    pImageNachher.loadPixels();
    const pixelsVorher = pImageVorher.pixels;
    const pixelsNachher = pImageNachher.pixels;

    // Hier läuft der Filterkernel über das Bild...
    for (let x = 0; x < breite; x++) {
      for (let y = 0; y < hoehe; y++) {
        const ausschnitt = bildauschnitt(x, y);
        let farbe = this.multipliziereUndAddiereArrays(ausschnitt, this.kernel);
        farbe = farbe/filterSumme;
        const position = ((y * breite + x) * 4)
        pixelsNachher[(y * breite + x) * 4] = farbe;
        pixelsNachher[(y * breite + x) * 4 + 1] = farbe;
        pixelsNachher[(y * breite + x) * 4 + 2] = farbe;
        pixelsNachher[(y * breite + x) * 4 + 3] = 255;
      }
    }
    const resultat = new Bild();
    resultat.pImage = pImageNachher;

    // Liefert einen Bildausschnitt 3x3 mit dem gegebeben Mittelpunkt als
    // eindimensionales Array
    function bildauschnitt(xMitte, yMitte) {
      const resultat = [];
      
      for (let y = yMitte-1; y < yMitte+2; y++) {
        for (let x = xMitte-1; x < xMitte+2; x++) {
          if (x < 0 || x >= breite || y < 0 || y >= hoehe) {
            resultat.push(0);
          } else {
            const pixelsIdx = (y * breite + x) * 4;
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