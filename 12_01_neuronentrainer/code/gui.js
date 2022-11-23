const GUI = {
  breite: undefined,
  bildPlotterLinks: undefined,
  bildPlotterRechts: undefined,
  fehlerArrayPlotter: undefined,
  arrayPlotter: undefined,
  fehlerAnzeige: undefined,
  aufgabenWaehler: undefined,
  neustartTrainingButton: undefined,
  lernrateWaehler: undefined,
  nNeuronenVerdeckteSchicht01Waehler: undefined,
  nNeuronenVerdeckteSchicht02Waehler: undefined,
  nGewichteAnzeige: undefined,
  pauseButton: undefined,
  schrittButton: undefined,

  // Zwischenspeicher zum Neuzeichnen
  datengenerator: undefined,
  netz: undefined,


  erzeugeGUI(){

    this.aktualisiereBreite();
    createCanvas(this.breite, this.breite);
    background(220);
    textFont("monospace", 13);
    smooth();

    // Anzeige Verhältnis zufälliger / tatsächlicher Fehler
    createElement("label", "Fehler zufällig | tatsächlich");
    this.fehlerAnzeige = createInput();
    this.fehlerAnzeige.attribute('disabled', '');
    this.fehlerAnzeige.style('background-color', 'white');
    this.fehlerAnzeige.style('color', 'black');

    // Anzeige Anzahl trainierter Beispiele
    createElement("label", "Anz. trainierter Beispiele").id("labelbreit");
    this.nBeispieleAnzeige = createInput().id("inputschmal");
    this.nBeispieleAnzeige.attribute('disabled', '');
    this.nBeispieleAnzeige.style('background-color', 'white');
    this.nBeispieleAnzeige.style('color', 'black');

    // Drop-Down Aufgabe
    createElement("label", "Aufgabe").id("labelschmal");
    this.aufgabenWaehler = createSelect().id("selectbreit");
    this.aufgabenWaehler.option("zweiStreifen");
    this.aufgabenWaehler.option("dreiStreifenDreiFarben");
    this.aufgabenWaehler.option("dreiStreifenZweiFarben");
    this.aufgabenWaehler.option("sechsStreifenSechsFarben");
    this.aufgabenWaehler.option("sechsStreifenZweiFarben");
    this.aufgabenWaehler.option("kachelungVierFarben2x2");
    this.aufgabenWaehler.option("kachelungZweiFarben2x2");
    this.aufgabenWaehler.option("kachelungVierFarben3x3");
    this.aufgabenWaehler.option("kachelungZweiFarben3x3");
    this.aufgabenWaehler.option("kreisUndHintergrund");
    this.aufgabenWaehler.option("quadratUndHintergrund");
    this.aufgabenWaehler.option("farbtunnelDreiFarben");
    this.aufgabenWaehler.option("farbtunnelSiebenFarben");
    this.aufgabenWaehler.option("waagerechtSenkrechtSechsFarben");
    this.aufgabenWaehler.value("kachelungVierFarben2x2");
    this.aufgabenWaehler.changed(neuesNetz);

    // Drop-Down Anzahl Neuronen erste verdeckte Schicht
    createElement("label", "Anz. Neuronen verdeckte Schicht 1").id("labelbreit");
    this.nNeuronenVerdeckteSchicht01Waehler = createSelect();
    this.nNeuronenVerdeckteSchicht01Waehler.option("0");
    this.nNeuronenVerdeckteSchicht01Waehler.option("1");
    this.nNeuronenVerdeckteSchicht01Waehler.option("2");
    this.nNeuronenVerdeckteSchicht01Waehler.option("3");
    this.nNeuronenVerdeckteSchicht01Waehler.option("4");
    this.nNeuronenVerdeckteSchicht01Waehler.option("5");
    this.nNeuronenVerdeckteSchicht01Waehler.option("10");
    this.nNeuronenVerdeckteSchicht01Waehler.option("15");
    this.nNeuronenVerdeckteSchicht01Waehler.option("20");
    this.nNeuronenVerdeckteSchicht01Waehler.option("25");
    this.nNeuronenVerdeckteSchicht01Waehler.option("30");
    this.nNeuronenVerdeckteSchicht01Waehler.option("40");
    this.nNeuronenVerdeckteSchicht01Waehler.option("50");
    this.nNeuronenVerdeckteSchicht01Waehler.option("75");
    this.nNeuronenVerdeckteSchicht01Waehler.option("100");
    this.nNeuronenVerdeckteSchicht01Waehler.option("200");
    this.nNeuronenVerdeckteSchicht01Waehler.option("250");
    this.nNeuronenVerdeckteSchicht01Waehler.value(25);
    this.nNeuronenVerdeckteSchicht01Waehler.changed(neuesNetz);

    // Drop-Down Anzahl Neuronen zweite verdeckte Schicht
    createElement("label", "Anz. Neuronen verdeckte Schicht 2").id("labelbreit");
    this.nNeuronenVerdeckteSchicht02Waehler = createSelect();
    this.nNeuronenVerdeckteSchicht02Waehler.option("0");
    this.nNeuronenVerdeckteSchicht02Waehler.option("1");
    this.nNeuronenVerdeckteSchicht02Waehler.option("2");
    this.nNeuronenVerdeckteSchicht02Waehler.option("3");
    this.nNeuronenVerdeckteSchicht02Waehler.option("4");
    this.nNeuronenVerdeckteSchicht02Waehler.option("5");
    this.nNeuronenVerdeckteSchicht02Waehler.option("10");
    this.nNeuronenVerdeckteSchicht02Waehler.option("15");
    this.nNeuronenVerdeckteSchicht02Waehler.option("20");
    this.nNeuronenVerdeckteSchicht02Waehler.option("25");
    this.nNeuronenVerdeckteSchicht02Waehler.option("30");
    this.nNeuronenVerdeckteSchicht02Waehler.option("40");
    this.nNeuronenVerdeckteSchicht02Waehler.option("50");
    this.nNeuronenVerdeckteSchicht02Waehler.option("75");
    this.nNeuronenVerdeckteSchicht02Waehler.option("100");
    this.nNeuronenVerdeckteSchicht02Waehler.changed(neuesNetz);
    
    // Anzeige Anzahl trainierbarer Gewichte
    createElement("label", "Anzahl trainierbarer Gewichte").id("labelbreit");
    this.nGewichteAnzeige = createInput().id("inputschmal");
    this.nGewichteAnzeige.attribute('disabled', '');
    this.nGewichteAnzeige.style('background-color', 'white');
    this.nGewichteAnzeige.style('color', 'black');

    // Drop-Down Lernrate
    createElement("label", "Lernrate ").id("labelbreit");;
    this.lernrateWaehler = createSelect();
    this.lernrateWaehler.option(0.001);
    this.lernrateWaehler.option(0.005);
    this.lernrateWaehler.option(0.01);
    this.lernrateWaehler.option(0.02);
    this.lernrateWaehler.option(0.03);
    this.lernrateWaehler.option(0.04);
    this.lernrateWaehler.option(0.05);
    this.lernrateWaehler.option(0.1);
    this.lernrateWaehler.value(0.03);
    this.lernrateWaehler.changed(lernrateGewaehlt);

    // Button Neustart Training
    this.neustartTrainingButton = createButton("Neustart Training");
    this.neustartTrainingButton.mousePressed(neustartTraining);

    // Button Pause / Weiter
    this.pauseButton = createButton("Pause / Weiter");
    this.pauseButton.mousePressed(pause_);

    // Button Lerne 250 Beispiele
    this.schrittButton = createButton("250 Beispiele");
    this.schrittButton.mousePressed(trainiereBeispiele);
  },

  // Zeichnet die Aufgabe und die aktuellen Voraussagen des Netzes
  zeichne(datenGenerator=this.datengenerator, netz=this.netz) {
    // Zwischenspeicher zum Neuzeichnen
    this.datengenerator = datenGenerator;
    this.netz = netz;

    this.bildPlotterLinks.zeichneBild(datenGenerator.bild);
    const berechnetesBild = this.berechneBild(datenGenerator, netz);
    this.bildPlotterRechts.zeichneBild(berechnetesBild);
    this.fehlerArrayPlotter.zuruecksetzen();
    this.fehlerArrayPlotter.zeichneArray(netz.fehlerHistory, 0, 1);
    const zufallVsQualitaet = nf(1 / datenGenerator.nKlassen, 1, 2) + " | " + nf(netz.letzterFehler, 1, 2);
    this.fehlerAnzeige.value(zufallVsQualitaet);
    this.nBeispieleAnzeige.value(netz.nTrainierteBeispiele);
    this.nGewichteAnzeige.value(netz.nGewichte);
  },

  // Berechnet das Bild, das die Voraussage des Netzes darstellt
  berechneBild(datenGenerator, netz) {
    const bild = createGraphics(100, 100);
    bild.noStroke();
    for (let x = 0; x < 1; x+= 0.02) {
      for (let y = 0; y < 1; y+= 0.02) {
        const klassenArray = netz.ausgabe([x, y]);
        const farbArray = datenGenerator.klassenArrayZuFarbArray(klassenArray);
        const xPos = x * 100.0;
        const yPos = y * 100.0;
        bild.fill(farbArray);
        bild.rect(xPos, yPos, 2, 2);
      }
    }
    return bild;
  },

  // Aktualisierung von this.breite abhängig von max-width.
  // Dient der Dynamisierung der Breite für unterschiedliche 
  // Screens. 
  aktualisiereBreite() {
    this.breite = int(window.getComputedStyle(document.body).getPropertyValue('max-width'));
    resizeCanvas(this.breite, this.breite*0.75);

    this.bildPlotterLinks = new BildPlotter("Aufgabe",
                                            0, 0,
                                            width/2, width/2+10);
    this.bildPlotterLinks.zuruecksetzen();

    this.bildPlotterRechts = new BildPlotter("Zuordnungen",
                                             width/2, 0,
                                             width/2, width/2+10);
    this.bildPlotterRechts.zuruecksetzen();

    this.fehlerArrayPlotter = new ArrayPlotter("Fehlerkurve",
                                               0, width/2+10,
                                               width, width/4-10);
    this.fehlerArrayPlotter.zuruecksetzen();
  }

}

// Dient der Dynamisierung der Breite für unterschiedliche Screens
window.addEventListener("resize", () => GUI.aktualisiereBreite());
window.addEventListener("resize", () => GUI.zeichne());