const GUI = {
  
  farben: [255, '#ca521f', '#87c1cb', '#dbb31a'],
  fruchtSprites: [],

  breite: 500,
  dZelle: undefined,
  
  canvas : undefined,
  neuesSpielButton: undefined,
  punktAnzeige: undefined,
  suchtiefeWaehler: undefined,

  spielzustand: undefined,
  
  erzeugeGUI() {
    
    this.canvas = createCanvas(this.breite, this.breite);
    this.aktualisiereBreite();

    // Drop-Down Random Seed
    createElement("label", "Spiel Nr.....");
    this.seedWaehler = createSelect();
    this.seedWaehler.option(1);
    this.seedWaehler.option(2);
    this.seedWaehler.option(3);
    this.seedWaehler.option(4);
    this.seedWaehler.option(5);
    this.seedWaehler.option(6);
    this.seedWaehler.option(7);
    this.seedWaehler.option(8);
    this.seedWaehler.option(9);
    this.seedWaehler.option(10);
    this.seedWaehler.value(1);

    // Drop-Down Suchtiefe
    createElement("label", "Suchtiefe.....");
    this.suchtiefeWaehler = createSelect();
    this.suchtiefeWaehler.option(3);
    this.suchtiefeWaehler.option(4);
    this.suchtiefeWaehler.option(5);
    this.suchtiefeWaehler.value(3);

    // Button Neues Spiel starten
    this.neuesSpielButton = createButton("Spiel starten");
    this.neuesSpielButton.mousePressed(neuesSpiel);
  
    // Button Neues KI-Spiel starten
    this.neuesSpielKIButton = createButton("Spiel starten KI");
    this.neuesSpielKIButton.mousePressed(neuesSpielKI);

    // Ausgabe Punktestand
    createElement("label", "Punkte.......");
    this.punktAnzeige = createInput();
    this.punktAnzeige.attribute('disabled', '');
  },

  // Spielzustand zeichnen
  zeichne(spielzustand=this.spielzustand){
    
    // Die GUI speichert den übergebenen Spielzustand zwischen.
    // Das wird benötigt, wenn der Spielzustand neu gezeichnet
    // werden muss.
    this.spielzustand = spielzustand;

    this.dZelle = this.breite / spielzustand.nZeilen;

    stroke(255);
    strokeWeight(2);

    // Zeichnen der einzelnen Zellen
    for (let zeile = 0; zeile < spielzustand.nZeilen; zeile++){
      for (let spalte = 0; spalte < spielzustand.nSpalten; spalte++){
        let farbe = spielzustand.farbe([zeile, spalte]);
        let x = spalte * this.dZelle;
        let y = zeile * this.dZelle;
        fill(this.farben[farbe]);
        rect(x, y, this.dZelle);
        if (farbe != 0) {
          image(this.fruchtSprites[farbe], x, y, this.dZelle, this.dZelle);
        }
      }
    }
    
    // Punkte anzeigen
    this.punktAnzeige.value(spielzustand.punkte);

    // Spielfeld angrauen, wenn das Spiel vorbei ist
    if (!spielzustand.zugIstMoeglich()) {
      fill(255, 100);
      rect(0, 0, this.breite);
    }
  },

  // Stellt fest, ob der Mauszeiger sich im Spielfeld befindet
  mausIstImSpielfeld(x, y, spielzustand) {
    let xLinks = 0;
    let xRechts = spielzustand.nSpalten * this.dZelle;
    let yOben = 0;
    let yUnten = spielzustand.nZeilen * this.dZelle;
    return x > xLinks &&
           x < xRechts &&
           y > yOben &&
           y < yUnten;
  },
  
  // Übersetzt die Mausposition zu Zellkoordinaten: Welcher Stein wurde
  // angeklickt?
  mausPositionZuKoordinaten(x, y){
    let spalte = floor((x) / this.dZelle);
    let zeile = floor((y) / this.dZelle);
    return [zeile, spalte];
  },

  // Lädt die zu den Steinen gehörenden Bilddateien
  ladeSprites(){
    this.fruchtSprites[1] = loadImage("daten/erdbeere.png");
    this.fruchtSprites[2] = loadImage("daten/trauben.png");
    this.fruchtSprites[3] = loadImage("daten/banane.png");
  },

  // Aktualisierung von this.breite abhängig von max-width.
  // Dient der Dynamisierung der Breite für unterschiedliche 
  // Screens.
  aktualisiereBreite() {
    this.breite = int(window.getComputedStyle(document.body).getPropertyValue('max-width'));
    this.canvas.resize(this.breite, this.breite);
  }

}

// Dient der Dynamisierung der Breite für unterschiedliche Screens
window.addEventListener("resize", () => GUI.aktualisiereBreite());
window.addEventListener("resize", () => GUI.zeichne());