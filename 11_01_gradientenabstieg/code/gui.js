const GUI = {

  breite: 400,
  xNeuButton: undefined,
  xAnzeige: undefined,
  schrittButton: undefined,
  yAnzeige: undefined,
  steigungAnzeige: undefined,
  steigungZeichnenCheckbox: undefined,
  zeichnungLoeschenCheckbox: undefined,
  gammaWaehler: undefined,

  xAktuell: undefined,
  funktion: undefined,
  ableitung: undefined,

  erzeugeGUI(){

    createCanvas(this.breite, 200);
    this.aktualisiereBreite();

    background(220);
    textFont("monospace", 13);

    // Button Neuer Startwert für x
    this.xNeuButton = createButton("Neuer Startwert für x");
    this.xNeuButton.mousePressed(xNeu);

    // Anzeige x
    createElement("label", "x..................").id("normal");
    this.xAnzeige = createInput();
    this.xAnzeige.id("normal");

    // Button Schritt
    this.schrittButton = createButton("Schritt");
    this.schrittButton.mousePressed(schrittButtonGedrueckt);
    this.schrittButton.mouseReleased(schrittButtonLosgelassen);
    this.schrittButton.touchStarted(schrittButtonGedrueckt);
    this.schrittButton.touchEnded(schrittButtonLosgelassen);
    
    // Anzeige y
    createElement("label", "y..................").id("normal");
    this.yAnzeige = createInput();
    this.yAnzeige.id("normal");
    
    // Drop-Down Lernrate
    createElement("label", "Lernrate...........").id("normal");
    this.lernrateWaehler = createSelect()
    this.lernrateWaehler.id("normal");
    this.lernrateWaehler.option(0.025);
    this.lernrateWaehler.option(0.05);
    this.lernrateWaehler.option(0.075);
    this.lernrateWaehler.option(0.1);
    this.lernrateWaehler.option(0.25);
    this.lernrateWaehler.option(0.5);
    this.lernrateWaehler.option(0.75);
    this.lernrateWaehler.option(1);
    this.lernrateWaehler.value(0.1);

    // Anzeige Steigung
    createElement("label", "Steigung...........").id("normal");;
    this.steigungAnzeige = createInput().id("normal");
    //createElement("br");

    // Checkbox Steigung zeichnen
    this.steigungZeichnenCheckbox = createCheckbox("Steigung zeichnen");
    this.steigungZeichnenCheckbox.checked(true);

    // Checkbox Steigung löschen bei Neuzeichnen
    this.zeichnungLoeschenCheckbox = createCheckbox("Steigung bei Schritt löschen");
  },

  // Zeichnet Koordinatensystem und die Graphen von Funktion und Ableitung
  zeichneKoordinatensystemUndGraphen(funktion=this.funktion,
                                     ableitung=this.ableitung){
    const xMin = -5;
    const xMax = 5;
    const yMin = -2.5;
    const yMax = 2.5;
    const xSchritt = 0.005;
    noStroke();
    background(255);

    for(let x = xMin; x < xMax; x += xSchritt) {
      const plotX = map(x, xMin, xMax, 0, width);
      const y = funktion(x);
      const plotY = map(y, yMin, yMax, height, 0);

      fill(255, 0, 0);
      ellipse(plotX, plotY, 2);
      noStroke();
      textSize(10);

      const yd = ableitung(x);
      const plotYd = map(yd, yMin, yMax, height, 0);
      fill(0, 0, 255);
      ellipse(plotX, plotYd, 2);

      
    }
    noStroke();
    textSize(12);
    fill(255,0,0);
    text("Originalfunktion", width/2+10, 230);
    fill(0,0,255);
    text("Ableitung", width/2+10, 250);
    stroke(0);
    strokeWeight(0.5)
    line(0, height/2, width, height/2);
    line(width/2, 0, width/2, height);
  },

  // Zeichnet aktuelle Position von x/y und Tangenten
  zeichne(xAktuell=this.xAktuell,
          funktion=this.funktion,
          ableitung=this.ableitung) {

    this.xAktuell = xAktuell;
    this.funktion = funktion;
    this.ableitung = ableitung;
    

    const xMin = -5;
    const xMax = 5;
    const yMin = -2.5;
    const yMax = 2.5;

    if (this.zeichnungLoeschenCheckbox.checked()) {
      this.zeichneKoordinatensystemUndGraphen(funktion, ableitung);
    } else {
      fill(255, 1);
      rect(0, 0, width, height);
    }

    const plotX = map(xAktuell, xMin, xMax, 0, width);
    const y = funktion(xAktuell);
    const plotY = map(y, yMin, yMax, height, 0);
    fill(0,200,0);
    stroke(0);
    ellipse(plotX, plotY, 10);

    let steigungAktuell = ableitung(xAktuell);
    const yAktuell = funktion(xAktuell);

    if (this.steigungZeichnenCheckbox.checked()) {

      let x1 = xAktuell-10;
      let y1 = yAktuell - 10 * steigungAktuell;
      let x2 = xAktuell+ 10;
      let y2 = yAktuell + 10 * steigungAktuell;

      x1 = map(x1, xMin, xMax, 0, width);
      y1 = map(y1, yMin, yMax, height, 0);
      x2 = map(x2, xMin, xMax, 0, width);
      y2 = map(y2, yMin, yMax, height, 0);
      
      stroke(0);
      strokeWeight(0.5);
      line(x1, y1, x2, y2);
    }

    if (abs(steigungAktuell) < 0.000001) {
      steigungAktuell = 0;
    }

    this.steigungAnzeige.value(nf(steigungAktuell, 1,6));
    this.xAnzeige.value(nf(xAktuell, 1,6));
    this.yAnzeige.value(nf(yAktuell, 1,6));
  },

  // Aktualisierung von this.breite abhängig von max-width.
  // Dient der Dynamisierung der Breite für unterschiedliche 
  // Screens.
  aktualisiereBreite() {
    this.breite = int(window.getComputedStyle(document.body).getPropertyValue('max-width'));
    resizeCanvas(this.breite, 260);
  }

}

// Dient der Dynamisierung der Breite für unterschiedliche Screens
window.addEventListener("resize", () => GUI.aktualisiereBreite());
window.addEventListener("resize", () => GUI.zeichne());
window.addEventListener("resize", () => GUI.zeichneKoordinatensystemUndGraphen());