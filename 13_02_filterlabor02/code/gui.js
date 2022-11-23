const GUI = {
  breite: undefined,
  ueberschrift: undefined,
  labelZeichenWaehler: undefined,
  zeichenWaehler: undefined,
  filterButton: undefined,
  

  erzeugeGUI(){
    createCanvas(595, 640);

    this.ueberschrift = createElement("h1", "Filterlabor II");

    // Drop-Down Zeichen
    this.labelZeichenWaehler = createElement("label", "Zeichen....");
    this.zeichenWaehler = createSelect();
    this.zeichenWaehler.size(50, 40);
    this.zeichenWaehler.changed(zeichenGewaehlt);
    this.zeichenWaehler.option("A");
    this.zeichenWaehler.option("B");
    this.zeichenWaehler.option("C");
    this.zeichenWaehler.option("K");
    this.zeichenWaehler.option("L");
    this.zeichenWaehler.option("N");
    this.zeichenWaehler.option("Q");
    this.zeichenWaehler.option("X");
    this.zeichenWaehler.option("Z");
    this.zeichenWaehler.option("❤");
    this.zeichenWaehler.option("⛔");
    this.zeichenWaehler.option("☕");
    this.zeichenWaehler.option("🌸");
    this.zeichenWaehler.value("K");
    
    // Button Filtern
    this.filterButton = createButton("neu filtern");
    this.filterButton.position(10, 260);
    this.filterButton.size(180, 50);
    this.filterButton.mousePressed(aktualisiereUndZeichne);

    this.aktualisiereXOffset();
  },

  // Zeichnet alle Filterketten und die zugehörigen Bildsequenzen
  zeichne(bildVorher,
          bildArray01,
          bildArray02,
          bildArray03,
          bildArray04,
          bildArray05,
          bildArray06) {
            
    bildVorher.zeichne(10, 50, 180, 180);

    if (bildArray01) {
      for (let bildIdx in bildArray01) {
        const bild = bildArray01[bildIdx];
        const x = 200;
        const y = 50 + bildIdx * 65;
        bild.zeichne(x, y, 60, 60);
      }
      for (let bildIdx in bildArray02) {
        const bild = bildArray02[bildIdx];
        const x = 265;
        const y = 50 + bildIdx * 65;
        bild.zeichne(x, y, 60, 60);
      }
      for (let bildIdx in bildArray03) {
        const bild = bildArray03[bildIdx];
        const x = 330;
        const y = 50 + bildIdx * 65;
        bild.zeichne(x, y, 60, 60);
      }
      for (let bildIdx in bildArray04) {
        const bild = bildArray04[bildIdx];
        const x = 395;
        const y = 50 + bildIdx * 65;
        bild.zeichne(x, y, 60, 60);
      }
      for (let bildIdx in bildArray05) {
        const bild = bildArray05[bildIdx];
        const x = 460;
        const y = 50 + bildIdx * 65;
        bild.zeichne(x, y, 60, 60);
      }
      for (let bildIdx in bildArray06) {
        const bild = bildArray06[bildIdx];
        const x = 525;
        const y = 50 + bildIdx * 65;
        bild.zeichne(x, y, 60, 60);
      }
    }
  },

  // Aktualisierung der Positionen aller DOM-Elemente bei resize.
  aktualisiereXOffset() {
    this.xOffset = (windowWidth/2) -width/2;
    if (windowWidth < width) {
      this.xOffset = 0;
    }
    this.ueberschrift.position(10 + this.xOffset, -10);
    this.labelZeichenWaehler.position(10 + this.xOffset, 250);
    this.zeichenWaehler.position(140 + this.xOffset, 250);
    this.filterButton.position(10 + this.xOffset, 310);
  }
}

// Neue Positionierung der DOM-Elemente bei resize veranlassen
window.addEventListener("resize", () => GUI.aktualisiereXOffset());  