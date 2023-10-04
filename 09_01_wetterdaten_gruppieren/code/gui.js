const GUI = {
  breite: undefined,
  farben: undefined,
  alpha: 200,
  schrittButton: undefined,
  zentrenZufaelligSetzenButton: undefined,
  punkteZuordnenButton: undefined,
  zentrenNeuBerechnenButton: undefined,
  kWaehler: undefined,

  erzeugeGUI() {

    this.aktualisiereBreite();
    createCanvas(this.breite, 360);
    background(255);
    textFont("monospace", 13);
    smooth();

    this.farben = [color(138, 43, 226, this.alpha), // violett
                   color(30, 144, 255, this.alpha), // blau
                   color(255, 127, 36, this.alpha), // orange
                   color(255, 0, 0, this.alpha),    // rot
                   color(0, 205, 0, this.alpha),    // grün
                   color(64,224,208, this.alpha),   // türkis
                   color(255, 215, 0, this.alpha),  // gold
                   color(255, 255, 0, 255)          // gelb
                  ];  

    // Drop-Down Anzahl Cluster / Zentren (k)
    createElement('label', 'Anzahl Cluster / Zentren (k)...').id("labelschmal");
    this.kWaehler = createSelect();
    this.kWaehler.changed(kGewaehlt);
    this.kWaehler.option(1);
    this.kWaehler.option(2);
    this.kWaehler.option(3);
    this.kWaehler.option(4);
    this.kWaehler.option(5);
    this.kWaehler.option(6);
    this.kWaehler.option(7);
    this.kWaehler.value(4);
     
    // Button Zentren zufällig setzen
    this.zentrenZufaelligSetzenButton = createButton("Zentren zufällig setzen");
    this.zentrenZufaelligSetzenButton.id("buttonbreithoch");
    this.zentrenZufaelligSetzenButton.mousePressed(zentrenZufaelligSetzen);

    createElement("label", "Teilschritte:")

    // Button Datenpunkte Zuordnen
    this.punkteZuordnenButton = createButton("Datenpunkte zuordnen");
    this.punkteZuordnenButton.mousePressed(datenpunkteZuordnen);

    // Button Zentren neu berechen
    this.zentrenNeuBerechnenButton = createButton("Zentren neu berechnen");
    this.zentrenNeuBerechnenButton.mousePressed(zentrenNeuBerechnen);


    // Button kompletter Schritt
    createElement("label", "Ein kompletter Schritt:")
    this.schrittButton = createButton("Datenpunkte zuordnen & Zentren neu berechnen");
    this.schrittButton.id("buttonbreithoch");
    this.schrittButton.mousePressed(schritt);

  },

  zeichne(kMeans=this.kMeans) {
    
    // Zwischenspeichern für Neuzeichnen...
    this.kMeans = kMeans;

    background(255);
    stroke(0);
    fill(0);
    textAlign(CENTER, CENTER);

    // Waagerechte Achse & Beschriftung zeichnen
    textSize(12);
    strokeWeight(1);
    line(20, height-20, width-20, height-20);
    line(width-20, height-20, width-30, height-25);
    line(width-20, height-20, width-30, height-15);
    textAlign(CENTER);
    strokeWeight(0.25);
    text("Temperatur (℃)", width/2, height-5 );
    text(kMeans.xMin, 20, height-5);
    text(kMeans.xMax, width-20, height-5);

    // Senkrechte Achse & Beschriftung zeichnen
    strokeWeight(1);
    line(20, 20, 20, height-20);
    line(15, 30, 20, 20);
    line(20, 20, 25, 30);
    strokeWeight(0.25);
    push();
    translate(15, height/2);
    rotate(-PI/2.0);
    text("Niederschlag (mm/Monat)", 0, 0 );
    pop();
    push();
    translate(15, height-30);
    rotate(-PI/2.0);
    text(kMeans.yMin, 0, 0);
    pop();
    push();
    translate(15, 30);
    rotate(-PI/2.0);
    text(kMeans.yMax, 0, 0);
    pop();

    const xMin = kMeans.xMin;
    const xMax = kMeans.xMax;
    const yMin = kMeans.yMin;
    const yMax = kMeans.yMax;

    // Für jeden Cluster...
    for (let idx in kMeans.cluster) {
      const farbe = this.farben[idx];
      fill(farbe);
      // Datenpunkte zeichnen...
      for (datenpunkt of kMeans.cluster[idx]) {
        const x = map(datenpunkt[0], xMin, xMax, 30, width-30);
        const y = map(datenpunkt[1], yMin, yMax, height-30, 30);
        noStroke();
        ellipse(x, y, 5);
      }
  
      // Clusterzentrum zeichnen...
      const zentrum = kMeans.zentren[idx];
      const x = map(zentrum[0], xMin, xMax, 30, width-30);
      const y = map(zentrum[1], yMin, yMax, height-30, 30);
      stroke(0);
      strokeWeight(1);
      ellipse(x, y, 10);
    }

    if (kMeans.punkteZugeordnet) {
      this.punkteZuordnenButton.attribute("disabled", "");
    } else {
      this.punkteZuordnenButton.removeAttribute("disabled", "");
    }

    if (kMeans.zentrenAktualisiert) {
      this.zentrenNeuBerechnenButton.attribute("disabled", "");
    } else {
      this.zentrenNeuBerechnenButton.removeAttribute("disabled", "");
    }

  },

  // Aktualisierung von this.breite abhängig von max-width.
  // Dient der Dynamisierung der Breite für unterschiedliche 
  // Screens.
  aktualisiereBreite() {
    this.breite = int(window.getComputedStyle(document.body).getPropertyValue('max-width'));
    resizeCanvas(this.breite, 360);
  }

}

// Dient der Dynamisierung der Breite für unterschiedliche Screens
window.addEventListener("resize", () => GUI.aktualisiereBreite());
window.addEventListener("resize", () => GUI.zeichne());

