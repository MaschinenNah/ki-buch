// Hilfsklasse zum Rendern und Darstellen von Zeichen

class Zeichen {

  constructor() {
    this.pImage = createImage(300, 300);
  }

  // Malt ein Unicode-Zeichen nach this.pGraphics
  rendereZeichen(zeichen) {
    const pGraphics = createGraphics(300, 300);
    pGraphics.background(128)
    pGraphics.stroke(255);
    pGraphics.strokeWeight(10);
    pGraphics.textSize(320);
    pGraphics.textStyle(BOLD);
    pGraphics.textAlign(CENTER, CENTER);
    pGraphics.fill(255);
    pGraphics.text(zeichen, 150, 175);
    this.pImage.copy(pGraphics, 0, 0, 300, 300, 0, 0, 300, 300);
  }

  zeichne(x, y, breite, hoehe) {
    if (this.pImage) {
      image(this.pImage, x, y, breite, hoehe);
    }
  }

}