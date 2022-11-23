// Hilfsklasse zum Laden und Zeichnen von Bildern (PImages)

class Bild {

  constructor() {
    this.pImage = undefined;
  }

  lade(pfad, callback) {
    this.pImage = loadImage(pfad, fertigGeladen);
    function fertigGeladen(pImage) {
      // Die Größe ist hier noch hardgecoded. Nicht schön, aber selten!
      pImage.resize(360, 270);
      callback();
    }
  }
  
  zeichne(x, y, breite, hoehe) {
    if (this.pImage) {
      image(this.pImage, x, y, breite, hoehe);
    } else {
      fill(255);
      rect(x, y, breite, hoehe);
    }
  }

}