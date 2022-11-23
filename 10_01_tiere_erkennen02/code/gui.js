const GUI = {
  breite: 500,
  sprites: {},

  erzeugeGUI(){
    createCanvas(this.breite, this.breite + 5);
    this.aktualisiereBreite();
    background(0);
    textFont("monospace", 22);
    noCursor();
    smooth();
  },

  zeichne(ausgaben) {
    this.zeichneKoordinatensystem();

    if (! ausgaben) {
      ausgaben = {
        haeschen: 0,
        igel: 0,
        hai: 0,
        vogelspinne: 0}
    }
    
    const farbe01 = color(0);
    const farbe02 = color(255);
    textAlign(LEFT, CENTER);
    stroke(255);
    strokeWeight(0.5);

    // Zeichnen der vier "Lampen"
    const farbeVogelspinneLampe = lerpColor(farbe01,
                                            farbe02,
                                            ausgaben.vogelspinne * 1.5);
    fill(farbeVogelspinneLampe);
    ellipse(40, width+20, 20, 20);
    fill(255);
    text("Vogelspinne", 70, width+20);
      
    const farbeHaeschenLampe = lerpColor(farbe01,
                                         farbe02,
                                         ausgaben.haeschen * 1.5);
    fill(farbeHaeschenLampe);
    ellipse(40, width+50, 20, 20);
    fill(255);
    text("Häschen", 70, width+50);

    const farbeHaiLampe = lerpColor(farbe01,
                                    farbe02,
                                    ausgaben.hai * 1.5);
    fill(farbeHaiLampe);
    ellipse(40, width+80, 20, 20);
    fill(255);
    text("Hai", 70, width+80);

    const farbeIgelLampe = lerpColor(farbe01,
                                     farbe02,
                                     ausgaben.igel * 1.5);
    fill(farbeIgelLampe);
    ellipse(40, width+110, 20, 20);
    fill(255);
    text("Igel", 70, width+110);
    
    if (! this.mausIstImSpielfeld()) {
      return;
    }

    const ausgabenAlsArray = [ausgaben.haeschen,
                              ausgaben.hai,
                              ausgaben.igel,
                              ausgaben.vogelspinne];

    // Ermittlung des Neurons mit der höchsten Aktivierung                          
    const gewinner = maxPos(ausgabenAlsArray, false);

    let sprite;
    let wert;

    // Auswahl des Sprites und der entsprechenden Aktivierung
    switch (gewinner) {
      case 0:
        sprite = this.sprites.haeschen;
        wert = ausgaben.haeschen;
        break;
      case 1:
        sprite = this.sprites.hai;
        wert = ausgaben.hai;
        break;
      case 2:
        sprite = this.sprites.igel;
        wert = ausgaben.igel;
        break;
      case 3:
        sprite = this.sprites.vogelspinne;
        wert = ausgaben.vogelspinne;
        break;
      case undefined:
        sprite = this.sprites.unbekannt;
        wert = 1;
        break;
    }

    // Zeichnen des Sprites
    imageMode(CENTER);
    const dSprite = map(wert, 0, 1, 20, 120)
    image(sprite, mouseX, mouseY, dSprite, dSprite);

  },

  // Zeichnet Koordinatensystem und Achsenbeschriftung
  zeichneKoordinatensystem() {
    // Waagerechte Achse & Beschriftung zeichnen
    fill(255);
    textSize(17);
    strokeWeight(1);
    line(20, width-20, width-20, width-20);
    line(width-20, width-20, width-30, width-25);
    line(width-20, width-20, width-30, width-15);
    textAlign(CENTER, CENTER);
    strokeWeight(0.25);
    text("Niedlichkeit", width/2, width-5 );
  
    // Senkrechte Achse & Beschriftung zeichnen
    strokeWeight(1);
    line(20, 20, 20, width-20);
    line(15, 30, 20, 20);
    line(20, 20, 25, 30);
    strokeWeight(0.25);
    push();
    translate(10, width/2);
    rotate(-PI/2.0);
    text("Flauschigkeit", 0, 0 );
    pop();
  },

  // Gibt true, wenn der Mauszeiger im Spielfeld ist
  mausIstImSpielfeld() {
    return mouseX > 20 && mouseX < width - 20 &&
           mouseY > 20 && mouseY < width - 20;
  },

  // Übersetzt die Mauszeigerposition in einen Datenpunkt
  mausPositionZuDatenpunkt(x, y) {
    const niedlichkeit = map(mouseX, 0, width, 0, 1);
    const flauschigkeit = map(mouseY, width, 0, 0, 1);
    return {niedlichkeit: niedlichkeit, flauschigkeit: flauschigkeit}
  },

  // Übersetzt Datenpunkt in Position auf dem Canvas
  datenpunktZuPosition(datenpunkt) {
    const x = map(datenpunkt.niedlichkeit, 0, 1, 0, width);
    const y = map(datenpunkt.flauschigkeit, 0, 1, width, 0);
    return {x: x, y: y}
  },

  // Lädt die Bilddateien zur Darstellung der Datenpunkte
  ladeSprites() {
    this.sprites.haeschen = loadImage("daten/haeschen.png");
    this.sprites.igel = loadImage("daten/igel.png");
    this.sprites.vogelspinne = loadImage("daten/vogelspinne.png");
    this.sprites.hai = loadImage("daten/hai.png");
    this.sprites.unbekannt = loadImage("daten/unbekannt.png");
  },

  // Aktualisierung von this.breite abhängig von max-width.
  // Dient der Dynamisierung der Breite für unterschiedliche 
  // Screens.
  aktualisiereBreite() {
    this.breite = int(window.getComputedStyle(document.body).getPropertyValue('max-width'));
    resizeCanvas(this.breite, this.breite + 150);
  }

}

// Dient der Dynamisierung der Breite für unterschiedliche Screens
window.addEventListener("resize", () => GUI.aktualisiereBreite());
