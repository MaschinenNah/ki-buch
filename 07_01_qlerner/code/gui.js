const GUI = {

  breite: undefined,
  dZelle: undefined,

  qLernerNeuButton: undefined,
  zielNeuButton: undefined,
  barriereNeuButton: undefined,
  pauseButton: undefined,
  schrittButton: undefined,
  turboSchrittButton: undefined,
  schrittAnzeige: undefined,
  episodenAnzeige: undefined,
  gammaWaehler: undefined,
  epsilonWaehler: undefined,
  speedWaehler: undefined,
  textMonitor: undefined,

  umwelt: undefined,
  qLerner: undefined,

  erzeugeGUI(){
    
    this.aktualisiereBreite();
    createCanvas(this.breite, this.breite);
    smooth();

    // Button Neuer Q-Lerner
    this.qLernerNeuButton = createButton("Neustart Q-Lerner");
    this.qLernerNeuButton.mousePressed(neuerQLerner);

    // Anzeige Anzahl Schritte
    createElement('label', 'Schritte').id("labelschmal");;
    this.schrittAnzeige = createInput();
    this.schrittAnzeige.id('schritte');

    // Button Neues Ziel
    this.zielNeuButton = createButton("Neues Ziel");
    this.zielNeuButton.mousePressed(umwelt.initialisiereZiel.bind(umwelt));

    // Anzeige Anzahl Episoden
    createElement('label', 'Episoden').id("labelschmal");;
    this.episodenAnzeige = createInput();
    this.episodenAnzeige.id('episoden');

    // Button Neue Barrieren
    this.barriereNeuButton = createButton("Neue Barrieren");
    this.barriereNeuButton.mousePressed(umwelt.initialisiereBarrieren.bind(umwelt))

    // Drop-Down Gamma
    createElement('label', 'Gamma');
    this.gammaWaehler = createSelect();
    this.gammaWaehler.option(0);
    this.gammaWaehler.option(0.1);
    this.gammaWaehler.option(0.5);
    this.gammaWaehler.option(0.9);
    this.gammaWaehler.option(1);
    this.gammaWaehler.value(0.9);
    this.gammaWaehler.changed(gammaGewaehlt);
  
    // Button Pause
    this.pauseButton = createButton("Pause / Weiter");
    this.pauseButton.mousePressed(pause_);

    // Drop-Down Epsilon
    createElement('label', 'Epsilon');
    this.epsilonWaehler = createSelect();
    this.epsilonWaehler.option(0);
    this.epsilonWaehler.option(0.05);
    this.epsilonWaehler.option(0.1);
    this.epsilonWaehler.option(0.2);
    this.epsilonWaehler.option(0.5);
    this.epsilonWaehler.option(0.9);
    this.epsilonWaehler.option(1);
    this.epsilonWaehler.value(0.1);
    this.epsilonWaehler.changed(epsilonGewaehlt);

    // Button Einzelschritt
    this.schrittButton = createButton("Einzelschritt");
    this.schrittButton.mousePressed(redraw);

    // Drop-Down Schritte/Sekunde
    createElement('label', 'Schritte/Sek ');
    this.speedWaehler = createSelect();
    this.speedWaehler.option(1);
    this.speedWaehler.option(2);
    this.speedWaehler.option(4);
    this.speedWaehler.option(8);
    this.speedWaehler.option(16);
    this.speedWaehler.option(32);
    this.speedWaehler.value(16);
    this.speedWaehler.changed(geschwGewaehlt);

    // Button 5000 Schritte
    this.turboSchrittButton = createButton("5000 Schritte");
    this.turboSchrittButton.mousePressed(turboSchritt);

    // Anzeige Zellenzustand
    this.textMonitor = createElement('textarea'); 
    this.textMonitor.attribute('disabled', '');

  },

  zeichne(umwelt=this.umwelt, qLerner=this.qLerner) {

    // Zwischenspeichern zum Neuzeichnen...
    this.umwelt = umwelt;
    this.qLerner = qLerner;

    this.dZelle = this.breite / umwelt.nZeilen;

    const qMax = 100;
    
    for (let zeile = 0; zeile < umwelt.nZeilen; zeile++) {
      for (let spalte = 0; spalte < umwelt.nSpalten; spalte++) {

        const x = spalte * this.dZelle;
        const y = zeile * this.dZelle;

        const zellenZustand = umwelt.zellenZustand(zeile, spalte);

        switch (zellenZustand) {
          case Umwelt.AGENT:
            fill(0,0,255);
            rect(x, y, this.dZelle);
            break;
          case Umwelt.BLOCKADE:
            fill(255, 0, 0);
            rect(x, y, this.dZelle);
            break;
          case Umwelt.ZIEL:
            fill(0,255,0);
            rect(x, y, this.dZelle);
            break;
          default:
            // "Normale" Zelle, ggf. mit Pfeil, falls bevorzugte Aktion
            const qWert = qLerner.qWert(zeile, spalte);
            const fuellFarbe = map(qWert, 0, qMax, 0, 255);
            fill(fuellFarbe);
            stroke(0);
            rect(x, y, this.dZelle);

            const aktionsPfeil = this.aktionsPfeil(umwelt, qLerner, zeile, spalte);
            fill(255);
            textAlign(CENTER, CENTER);
            const textGroessePfeil = map(this.dZelle, 10, 100, 10, 80);
            textSize(textGroessePfeil);
            text(aktionsPfeil, x + this.dZelle*0.5, y + this.dZelle*0.5);
        }
      }
    }

    this.schrittAnzeige.value(qLerner.nSchritte);
    this.episodenAnzeige.value(umwelt.nEpisoden);
  },

  // Übersetzt Mauskoordinaten in Zellkoordinaten
  mausPositionZuZelle(x, y){
    let spalte = floor((x) / this.dZelle);
    let zeile = floor((y) / this.dZelle);
    return {zeile: zeile, spalte: spalte}
  },

  // Stellt fest, ob der Mauszeiger im Spielfeld ist
  mausImSpielfeld(x, y){
    return x > 0 && x < width && y > 0 && y < height;
  },

  // Liefert einen String, der einen Pfeil (↑, ↓, ← oder →) enthält,
  // wenn es eine bevorzugte Richtung gibt, sonst undefined
  aktionsPfeil(umwelt, qLerner, zeile, spalte){
    const zustandsNr = umwelt.koordinateNachZustandsNr(zeile, spalte);
    const qTabellenZeile = qLerner.qTabelle[zustandsNr];
    if(!alleGleich(qTabellenZeile)) {
      const aktionsNr = qLerner.aktionOhneEpsilon(zustandsNr);
      switch (aktionsNr) {
        case 0:
          return "↑"
        case 1:
          return "↓"
        case 2:
          return "←"
        case 3:
          return "→"
      } 
    }
    return "";
  },

  // Liefert die Darstellung einer Zelle (= eines Umweltzustandes)
  // für den textMonitor
  zelleAlsString(qLerner, zeile, spalte, zustandsNr) {
    const qTabellenZeile = qLerner.qTabelle[zustandsNr];
    resultat = "";
    resultat += "[Zeile, Spalte]: [" + zeile + ", " + spalte + "]\n";
    resultat += "Zustands-Nummer: " + zustandsNr + "\n";
    resultat += "Aktion  Q-Wert\n"
    resultat += "hoch:   " + nf(qTabellenZeile[0],1,3) + "\n";
    resultat += "runter: " + nf(qTabellenZeile[1],1,3) + "\n";
    resultat += "links:  " + nf(qTabellenZeile[2],1,3) + "\n";
    resultat += "rechts: " + nf(qTabellenZeile[3],1,3);
    return resultat;
  },

  // Aktualisierung von this.breite abhängig von max-width.
  // Dient der Dynamisierung der Breite für unterschiedliche 
  // Screens.
  aktualisiereBreite() {
    this.breite = int(window.getComputedStyle(document.body).getPropertyValue('max-width'));
    resizeCanvas(this.breite, this.breite);  
  }

}

// Dient der Dynamisierung der Breite für unterschiedliche Screens
window.addEventListener("resize", () => GUI.aktualisiereBreite());
window.addEventListener("resize", () => GUI.zeichne());