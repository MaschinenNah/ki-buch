const GUI = {
  breite: undefined,
  kWaehler: undefined,
  sprites: {},

  // Zwischenspeicher zum Neuzeichnen:
  datenpunkte: undefined,
  datenpunktA: undefined,
  nachbarn: undefined,

  erzeugeGUI(){
    this.aktualisiereBreite();
    createCanvas(this.breite, this.breite);
    background(220);
    textFont("monospace", 20);
    smooth();
    
    createElement("label", "Anzahl Nachbarn (k)");
    this.kWaehler = createSelect();
    this.kWaehler.option(1);
    this.kWaehler.option(2);
    this.kWaehler.option(3);
    this.kWaehler.option(4);
    this.kWaehler.option(5);
    this.kWaehler.option(6);
    this.kWaehler.option(7);
    this.kWaehler.value(5);
  },

  zeichneDatenpunkte(datenpunkte = this.datenpunkte) {
    this.datenpunkte = datenpunkte;
    
    this.zeichneKoordinatensystem();
    imageMode(CENTER);
    for (let datenpunkt of datenpunkte) {
      this.zeichneDatenpunkt(datenpunkt);
    }
  },

  zeichneDatenpunkt(datenpunkt, schreibeKoordinaten) {
    const x = map(datenpunkt.niedlichkeit, 0, 1, 0, width);
    const y = map(datenpunkt.flauschigkeit, 0, 1, width, 0);
    const spezies = datenpunkt.spezies;
    const sprite = this.sprites[spezies];
    image(sprite, x, y, 40, 40);
    if (schreibeKoordinaten) {
      push();
      fill(0);
      noStroke(0);
      textAlign(LEFT);
      textSize(12);
      strokeWeight(1)
      text("niedlichkeit:  " + nf(datenpunkt.niedlichkeit, 1,2), x + 30, y - 10);
      text("flauschigkeit: " + nf(datenpunkt.flauschigkeit, 1,2), x + 30, y + 10);
      pop();
    }
  },

  zeichneNachbarschaft(datenpunktA = this.datenpunktA, nachbarn = this.nachbarn) {

    this.datenpunktA = datenpunktA;
    this.nachbarn = nachbarn;
    
    if(!datenpunktA) {
      return;
    }
    const x1 = map(datenpunktA.niedlichkeit, 0, 1, 0, width);
    const y1 = map(datenpunktA.flauschigkeit, 0, 1, width, 0);
    for (let datenpunktB of nachbarn) {
      const x2 = map(datenpunktB.niedlichkeit, 0, 1, 0, width);
      const y2 = map(datenpunktB.flauschigkeit, 0, 1, width, 0);
      strokeWeight(3);
      stroke(120);
      line(x1, y1, x2, y2);
    }
  
    this.zeichneDatenpunkt(datenpunktA, true);
  },

  zeichneKoordinatensystem() {
    // Waagerechte Achse & Beschriftung zeichnen
    textSize(12);
    strokeWeight(1);
    line(20, height-20, width-20, height-20);
    line(width-20, height-20, width-30, height-25);
    line(width-20, height-20, width-30, height-15);
    textAlign(CENTER);
    strokeWeight(0.25);
    text("Niedlichkeit", width/2, height-5 );
  
    // Senkrechte Achse & Beschriftung zeichnen
    strokeWeight(1);
    line(20, 20, 20, height-20);
    line(15, 30, 20, 20);
    line(20, 20, 25, 30);
    strokeWeight(0.25);
    push();
    translate(15, height/2);
    rotate(-PI/2.0);
    text("Flauschigkeit", 0, 0 );
    pop();
  },

  neuzeichnen() {
    background(220);
    this.zeichneKoordinatensystem();
    this.zeichneNachbarschaft();
    this.zeichneDatenpunkte();
  },

  // Befindet sich der Mauszeiger im "Spielfeld"?
  mausIstImSpielfeld() {
    return mouseX > 0 && mouseX < width &&
           mouseY > 0 && mouseY < height;
  },

  // Übersetzt Mauszeigerposition in einen Datenpunkt
  mausPositionZuDatenpunkt(x, y) {
    const niedlichkeit = map(mouseX, 0, width, 0, 1);
    const flauschigkeit = map(mouseY, width, 0, 0, 1);
    return {niedlichkeit: niedlichkeit, flauschigkeit: flauschigkeit}
  },

  // Übersetzt einen Datenpunkt in eine Position
  datenpunktZuPosition(datenpunkt) {
    const x = map(datenpunkt.niedlichkeit, 0, 1, 0, width);
    const y = map(datenpunkt.flauschigkeit, 0, 1, width, 0);
    return {x: x, y: y}
  },

  // Lädt die Bilder, die zu den Klassen gehören
  ladeSprites() {
    this.sprites.haeschen = loadImage("daten/haeschen.png");
    this.sprites.igel = loadImage("daten/igel.png");
    this.sprites.vogelspinne = loadImage("daten/vogelspinne.png");
    this.sprites.hai = loadImage("daten/hai.png");
    this.sprites.unbekannt = loadImage("daten/unbekannt.png");
  },

  // Aktualisierung der Breite bei resize
  aktualisiereBreite() {
    this.breite = int(window.getComputedStyle(document.body).getPropertyValue('max-width'));
    resizeCanvas(this.breite, this.breite);
  }

}

// Veranlasst Aktualisierung der Breite und Neuzeichnen bei resize
window.addEventListener("resize", () => GUI.aktualisiereBreite());
window.addEventListener("resize", () => GUI.neuzeichnen());
