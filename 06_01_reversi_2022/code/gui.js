const GUI = {

  farben: [0, "#228B22", 255],
  namen: ["SCHWARZ (Mensch)", , "WEISS (Maschine)"],

  canvas: undefined,

  breite: 400,
  dZelle: undefined,
  
  koordinatenCheckbox: undefined,
  alphaBetaCheckbox: undefined,
  suchtiefeWaehler: undefined,
  neuesSpielButton: undefined,
  textMonitor: undefined,

  erzeugeGUI() {
    
    this.canvas = createCanvas(this.breite, this.breite);
    this.aktualisiereBreite();
    
    // Checkbox Koordinaten anzeigen
    this.koordinatenCheckbox = createCheckbox("Koordinaten anzeigen", false);
    this.koordinatenCheckbox.changed(this.zeichne);

    // Checkbox Alpha Beta Pruning
    this.alphaBetaCheckbox = createCheckbox("Alpha-Beta Pruning", false);
    this.alphaBetaCheckbox.changed(this.zeichne);

    // Drop-Down Suchtiefe
    createElement("label", "Suchtiefe").id("labelsuchtiefe");
    this.suchtiefeWaehler = createSelect();
    this.suchtiefeWaehler.option(1);
    this.suchtiefeWaehler.option(2);
    this.suchtiefeWaehler.option(3);
    this.suchtiefeWaehler.option(4);
    this.suchtiefeWaehler.option(5);
    this.suchtiefeWaehler.option(6);
    this.suchtiefeWaehler.option(7);
    this.suchtiefeWaehler.option(8);
    this.suchtiefeWaehler.value(1);

    // Button Neues Spiel
    this.neuesSpielButton = createButton("Neues Spiel");
    this.neuesSpielButton.mousePressed(neuesSpiel);

    // Anzeige Textnachrichten
    this.textMonitor = createElement('textarea'); 
    this.textMonitor.attribute('disabled', '');
    this.textMonitor.style('background-color', 'white');
    this.textMonitor.style('color', 'black');
    this.textMonitor.style('resize', 'none');
  },

  zeichne(spielzustand=this.spielzustand){

    // Die GUI speichert den übergebenen Spielzustand zwischen.
    // Das wird benötigt, wenn der Spielzustand neu gezeichnet
    // werden muss.
    this.spielzustand = spielzustand;

    this.dZelle = this.breite / spielzustand.groesse;
    
    // Diese Zeile verhindert aus ungeklärten Gründen Fehler beim
    // Neuzeichnen nach resize
    fill(0);

    for (let zeile = 0; zeile < spielzustand.groesse; zeile++){
      for (let spalte = 0; spalte < spielzustand.groesse; spalte++){

        let farbe = spielzustand.farbe([zeile, spalte]) + 1
        let x = spalte * this.dZelle;
        let y = zeile * this.dZelle;

        // Felder zeichnen
        stroke(0);
        strokeWeight(1);
        fill(this.farben[1]);
        rect(x, y, this.dZelle);

        // Steine zeichnen
        if(farbe != 1) {
          noStroke();
          fill(this.farben[farbe]);
          ellipse(x+this.dZelle/2, y+this.dZelle/2, this.dZelle);
        }

        // Kooordinaten anzeigen
        if (this.koordinatenCheckbox.checked()) {
          stroke(0);
          strokeWeight(2);
          fill(255);
          textSize(15);
          textAlign(CENTER, CENTER);
          const koordinatenString = zeile.toString() + "|" + spalte.toString();
          text(koordinatenString, x+this.dZelle/2, y+this.dZelle/2)
        }
      } 
    }

    // Spielfeld angrauen, wenn der menschliche Spieler nicht am Zug oder
    // das Spiel zuende ist
    if (spielzustand.spieler != -1) {
      fill(255, 100);
      rect(0, 0, this.breite);
    } 
    
    // Nachrichten für den textMonitor...
    this.textMonitor.html("");
    let nachricht;
    
    // Spiel läuft...
    if (!spielzustand.spielIstZuende()) {
      nachricht = this.namen[spielzustand.spieler + 1] + " IST AM ZUG" + "\n";
      nachricht += "BEWERTUNG: " + spielzustand.bewertung() + "\n";
      if (spielzustand.bewertung() < 0) {
        nachricht += "(Vorteil Mensch)";
      } else if (spielzustand.bewertung() > 0) {
        nachricht += "(Vorteil Maschine)";
      } else {
        nachricht += "(Neutral)";
      }
    } else {
      // Spiel ist zuende...
      fill(255, 100);
      rect(0, 0, this.breite);
      const gewinner = spielzustand.gewinner();

      switch (gewinner) {
        case -1:
          nachricht = this.namen[gewinner + 1] + " HAT GEWONNEN\n"
          break;
        case 1:
          nachricht = this.namen[gewinner + 1] + " HAT GEWONNEN\n"
          break;
        default:
          lg(gewinner)
          nachricht = "UNENTSCHIEDEN \n"
      }
      nachricht += "PUNKTE SCHWARZ: " + spielzustand.punkteVerhaeltnis().schwarz;
      nachricht += "\nPUNKTE WEISS:   " + spielzustand.punkteVerhaeltnis().weiss;
    }

    this.textMonitor.html(nachricht);
    
  },

  // Übersetzt die Mausposition zu Zellkoordinaten: Welche Zelle wurde
  // angeklickt?
  mausPositionZuZelle(x, y){
    let spalte = floor((x) / this.dZelle);
    let zeile = floor((y) / this.dZelle);
    return [zeile, spalte];
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