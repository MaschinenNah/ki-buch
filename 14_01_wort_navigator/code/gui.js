const GUI = {
  breite: undefined,
  hoehe: undefined,
  skalierung: 1,
  translationX: 0,
  translationY: 0,
  deltaX: undefined,
  deltaY: undefined,

  hintergrund: 255,
  schrittHelligkeitStart: 140,
  schrittHelligkeitRange: 115,

  canvas: undefined,
  einbettungsWaehler: undefined,
  zoomSlider: undefined,
  zoomSliderWert: undefined,
  zoomResetButton: undefined,
  maxSchriftgroesse: 1.5,
  schriftgroesseSlider: undefined,
  schriftgroesseWert: undefined,
  wortfeldA: undefined,
  wortfeldB: undefined,
  wortfeldC: undefined,
  wortfelderResetButton: undefined,
  wortfeldD: undefined,
  gewaehltesWortfeld: undefined,

  wortA: undefined,
  wortB: undefined,
  wortC: undefined,
  wortD: undefined,

  gewaehltesWort: undefined,

  textMonitorOben: undefined,
  textMonitorUnten: undefined,
  
  divLinks: undefined,
  divRechts: undefined,
  divGesamt: undefined,

  // Das farbwaehlerBild doppelt die sichtbare Darstellung der Worteinbettung.
  // Hier wird aber jedes Wort in einer zufällig gewählten, eindeutigen Farbe
  // Dargestellt. Dies dient der Auswahl eines Wortes per Mausklick. Der Klick
  // wird auf das Farbwählerbild übertragen, und die Farbe des getroffenen
  // Pixels identifiziert das angeklickte Wort.
  farbwaehlerBild: undefined,

  erzeugeGUI(){
    this.breite = 600;
    this.hoehe = 600
    this.translationX = this.breite/2;
    this.translationY = this.hoehe/2;

    this.divLinks = createDiv();
    this.divLinks.style('background', 'rgb(255, 211, 129)');
    this.divLinks.style('border', '5px solid rgb(255, 211, 129)');
    this.divLinks.style('width', '600px');

    this.divRechts = createDiv();
    this.divRechts.style('background', 'rgb(255, 211, 129)');
    this.divRechts.style('border', '5px solid rgb(255, 211, 129)');
    this.divRechts.style('width', '400px');

    this.divGesamt = createDiv();
    this.divGesamt.style('border', '5px solid rgb(255, 211, 129)');
    this.divGesamt.child(this.divLinks);
    this.divGesamt.child(this.divRechts);
    this.divGesamt.style('display', 'flex');

    createElement("label", "Einbettungsraum")
      .parent(this.divLinks)
      .addClass("labelBreit");
    this.canvas = createCanvas(this.breite, this.hoehe);
    this.canvas.parent(this.divLinks);
    this.canvas.mouseMoved(() => redraw());
    textFont("monospace", 1);
    background(this.hintergrund);

    createElement("br")
      .parent(this.divLinks);

    createElement("label", "Zoom..........").parent(this.divLinks);
    const aufloesung = 100;
    this.zoomSlider = createSlider(0, aufloesung, 5).parent(this.divLinks);
    this.zoomSlider.addClass("slider");
    this.zoomSlider.mouseMoved(() => this.aktualisiereZoom());
    this.zoomSliderWert = createInput();
    this.zoomSliderWert.parent(this.divLinks);
    this.zoomSliderWert.addClass("inputSchmal");
    this.aktualisiereZoom();

    this.zoomResetButton = createButton("zurücksetzen");
    this.zoomResetButton.parent(this.divLinks);
    this.zoomResetButton.mousePressed(()=> this.resetZoom());
    
    createElement("label", "Schriftgröße").parent(this.divLinks);
    this.schriftgroesseSlider = createSlider(0, aufloesung, aufloesung/2);
    this.schriftgroesseSlider.parent(this.divLinks);
    this.schriftgroesseSlider.addClass("slider");
    this.schriftgroesseSlider.mouseMoved(() =>
      this.aktualisiereSchriftgroesse()
    );
    this.schriftgroesseWert = createInput().parent(this.divLinks)
    this.schriftgroesseWert.addClass("inputSchmal");
    this.schriftgroesseWert.value(map(this.schriftgroesseSlider.value(), 
                                      0,
                                      aufloesung,
                                      0.1,
                                      this.maxSchriftgroesse));
                        
    this.schriftgroesseResetButton = createButton("zurücksetzen");
    this.schriftgroesseResetButton.parent(this.divLinks);
    this.schriftgroesseResetButton.mousePressed(() => 
      this.resetSchriftgroesse()
    );

    createElement("br")
      .parent(this.divLinks);

    createElement("label", "Wort A").parent(this.divLinks);
    createElement("label", "Wort B").parent(this.divLinks);
    createElement("label", "Wort C").parent(this.divLinks);
    createElement("br")
      .parent(this.divLinks);
    
    this.wortfeldA = createInput();
    this.wortfeldA.parent(this.divLinks);
    this.wortfeldA.mousePressed(() => this.gewaehltesWortfeld = this.wortfeldA);
    this.wortfeldA.input(() => redraw());
    this.wortfeldB = createInput();
    this.wortfeldB.parent(this.divLinks);
    this.wortfeldB.mousePressed(() => this.gewaehltesWortfeld = this.wortfeldB);
    this.wortfeldB.input(() => redraw());
    this.wortfeldC = createInput();
    this.wortfeldC.parent(this.divLinks);
    this.wortfeldC.mousePressed(() => this.gewaehltesWortfeld = this.wortfeldC);
    this.wortfeldC.input(() => redraw());
    this.wortfelderResetButton = createButton("zurücksetzen");
    this.wortfelderResetButton.parent(this.divLinks);
    this.wortfelderResetButton.mousePressed(() => this.wortfelderReset());

    createElement("label", "Wort D =<br>Wort C + (Wort B - Wort A)")
      .parent(this.divLinks)
      .addClass("labelBreit");
    this.wortfeldD = createInput();
    this.wortfeldD.parent(this.divLinks);

    createElement("label", "Bericht Einbettung")
      .parent(this.divRechts)
      .addClass("labelBreit");
    this.textMonitorOben = createElement('textarea')
    this.textMonitorOben.parent(this.divRechts);
    this.textMonitorOben.addClass("textareaOben");
    this.textMonitorOben.attribute('disabled', '');
    createElement("br").parent(this.divLinks);

    createElement("label", "Einbettung laden....")
      .parent(this.divLinks)
      .addClass("labelBreit");
    this.einbettungsWaehler = createSelect();
    this.einbettungsWaehler.parent(this.divLinks)
    this.einbettungsWaehler.addClass("selectBreit");
    this.einbettungsWaehler.option("berufe01");
    this.einbettungsWaehler.option("berufe02");
    this.einbettungsWaehler.option("berufe03");
    this.einbettungsWaehler.option("katzenstein");
    this.einbettungsWaehler.value("berufe01");
    this.einbettungsWaehler.changed(einbettungGewaehlt);

    createElement("label", "Bericht Wörter")
      .parent(this.divRechts)
      .addClass("labelBreit");
    this.textMonitorUnten = createElement('textarea');
    this.textMonitorUnten.parent(this.divRechts); 
    this.textMonitorUnten.attribute('disabled', '');

    this.farbwaehlerBild = createGraphics(this.breite, this.hoehe);
  },

  // TODO: Diese Funktion ist viel zu umfangreich, und sollte aufgeteilt werden
  zeichneWorteinbettung(worteinbettung) {
    background(this.hintergrund);
    this.farbwaehlerBild.background(0);

    // WortA, B, C und D ///////////////////////////////////////////////////////
    const wortA = this.wortfeldA.value();
    const wortB = this.wortfeldB.value();
    const wortC = this.wortfeldC.value();

    if (worteinbettung.vokabular) {
      if (worteinbettung.vokabular.includes(wortA)) {
        this.wortfeldA.style('background-color', "white");
        worteinbettung.wortZuVektorDict2D = 
          schluesselAnsEnde(worteinbettung.wortZuVektorDict2D, wortA);
        this.wortA = wortA;
      } else {
        this.wortfeldA.style('background-color', "#A9A8A9");
        this.wortA = undefined;
      }
      if (worteinbettung.vokabular.includes(wortB)) {
        this.wortfeldB.style('background-color', "white");
        worteinbettung.wortZuVektorDict2D = schluesselAnsEnde(worteinbettung.wortZuVektorDict2D, wortB);
        this.wortB = wortB;
      } else {
        this.wortfeldB.style('background-color', "#A9A8A9");
        this.wortB = undefined;
      }
      if (worteinbettung.vokabular.includes(wortC)) {
        this.wortfeldC.style('background-color', "white");
        worteinbettung.wortZuVektorDict2D = schluesselAnsEnde(worteinbettung.wortZuVektorDict2D, wortC);
        this.wortC = wortC;
      } else {
        this.wortfeldC.style('background-color', "#A9A8A9");
        this.wortC = undefined;
      }
    }

    if (this.wortA && this.wortB){
      this.berichtUnten("Differenzvektor zwischen\n'" + this.wortB + "'" 
                        + "\nund\n'" + this.wortA  + "'\nermittelt.", true);
      if (this.wortC) {
        this.berichtUnten();
        this.berichtUnten("Differenzvektor zu \n'" + this.wortC + "'\naddiert.");
        let nachbarString = "";

        const nachbarn = worteinbettung.relationsTransformation(this.wortA, 
                                                                this.wortB, 
                                                                this.wortC, 
                                                                mode="dict");

        for (let nachbar of nachbarn) {
          nachbarString += nachbar.wort.padEnd(18) 
                           + " : " 
                           + nachbar.aehnlichkeit.toFixed(3) + "\n"
        }
        this.berichtUnten();
        this.berichtUnten("Nächstgelegene Wörter:");
        this.berichtUnten(nachbarString);
      }
    } else {
      this.wortfeldD.value("");
      this.wortD = "";
      this.leereBerichtUnten();
    }

    if (this.wortA && this.wortB && this.wortC){
      const wortD = worteinbettung.relationsTransformation(this.wortA,
                                                           this.wortB,
                                                           this.wortC, 
                                                           mode="single");
      this.wortfeldD.value(wortD);
      this.wortD = wortD;
      redraw();
    } 


    // Lupenkreis //////////////////////////////////////////////////////////
    noFill();////
    stroke(0);
    strokeWeight(0.25);
    circle(this.breite/2, this.hoehe/2, 100);
    fill(0);
    noStroke();
    this.farbwaehlerBild.noStroke();
    this.farbwaehlerBild.fill(255);

    // Skalierung und Transformation ///////////////////////////////////////////
    this.farbwaehlerBild.push();
    const zentrumX = this.breite/2;
    const zentrumY = this.hoehe/2;
    const zoom = GUI.zoomSliderWert.value();

    if (this.deltaX) {

      translate(zentrumX, zentrumY);
      this.farbwaehlerBild.translate(zentrumX*2, zentrumY*2);
      scale(zoom);
      this.farbwaehlerBild.scale(zoom);
      translate(-zentrumX, -zentrumY);
      this.farbwaehlerBild.translate(-zentrumX, -zentrumY);

      let skalierteMausPosition = this.mausPositionZuKoordinaten(mouseX,
                                                                 mouseY);
      translate(
        this.translationX + skalierteMausPosition.x - this.deltaX, 
        this.translationY + skalierteMausPosition.y - this.deltaY);

      this.farbwaehlerBild.translate(
          this.translationX + skalierteMausPosition.x - this.deltaX, 
          this.translationY + skalierteMausPosition.y - this.deltaY);
    } else {

      translate(zentrumX, zentrumY);
      scale(zoom);
      translate(-zentrumX, -zentrumY);
      this.farbwaehlerBild.translate(zentrumX, zentrumY);
      this.farbwaehlerBild.scale(zoom);
      this.farbwaehlerBild.translate(-zentrumX, -zentrumY);

      translate(this.translationX, this.translationY);
      this.farbwaehlerBild.translate(this.translationX, this.translationY);
    }

    const schriftGroesse = map(zoom,
                               0.0,
                               30.0, 
                               8*GUI.schriftgroesseWert.value(), 
                               4*GUI.schriftgroesseWert.value());
    textSize(schriftGroesse);
    this.farbwaehlerBild.textSize(schriftGroesse*1.1);
    
    textAlign(CENTER);
    this.farbwaehlerBild.textAlign(CENTER);

    // Embedding zeichnen //////////////////////////////////////////////////////
    const dict2D = worteinbettung.wortZuVektorDict2D;

    const nVokabeln = worteinbettung.nVokabeln;

    const farbschritt = this.schrittHelligkeitRange / nVokabeln;

    let schrittFarbe = this.schrittHelligkeitStart;
    
    for (let wort in dict2D) {
      schrittFarbe += farbschritt;
      const vektor = dict2D[wort];
      let x;
      let y;
      if (vektor) {
        x = vektor[0];
        y = vektor[1];
      } else {
        continue;
      }
  
      let farbe;      
      if(worteinbettung.wortZuFarbeDict) {
        farbe = worteinbettung.wortZuFarbeDict[wort];
      } else {
        farbe = color(255);
      }
      stroke(schrittFarbe);
      strokeWeight(schriftGroesse*0.3);
      text(wort, x, y); 
      this.farbwaehlerBild.stroke(farbe);
      this.farbwaehlerBild.fill(farbe);
      this.farbwaehlerBild.strokeWeight(schriftGroesse*0.4);
      this.farbwaehlerBild.text(wort, x, y); 
    }
        
    // Relationen zeichnen /////////////////////////////////////////////////////
    fill(0);
    if (this.wortA && this.wortB) {
      stroke(0, 200);
      strokeWeight(schriftGroesse*0.2)
      const pA = worteinbettung.wortZuVektorDict2D[this.wortA];
      const pB = worteinbettung.wortZuVektorDict2D[this.wortB];
      line(pA[0], pA[1], pB[0], pB[1]);
    }
        
    if (this.wortC && this.wortD) {
      stroke(0, 200);
      strokeWeight(schriftGroesse*0.2)
      const pC = worteinbettung.wortZuVektorDict2D[this.wortC];
      const pD = worteinbettung.wortZuVektorDict2D[this.wortD];
      line(pC[0], pC[1], pD[0], pD[1]);
    }

    // gewählte Wörter markieren ///////////////////////////////////////////////
    for (let gewaehltesWort of [this.gewaehltesWort,
                                this.wortA, 
                                this.wortB, 
                                this.wortC, 
                                this.wortD]) {
      if(gewaehltesWort) {
        const vektor = dict2D[gewaehltesWort];
        let x;
        let y;
        if (vektor) {
          x = vektor[0];
          y = vektor[1];
        } else {
          continue;
        }
        farbe = color(255, 166, 0)
        textSize(schriftGroesse*1.5)
        stroke(farbe);
        strokeWeight(schriftGroesse*0.5);
        text(gewaehltesWort, x, y);
        
        stroke(255);
        strokeWeight(schriftGroesse*0.4);
        text(gewaehltesWort, x, y);
      }  
    }

    const x = this.mausPositionZuKoordinaten(0, 0).x
    const y = this.mausPositionZuKoordinaten(0, 0).y;

    const x2 = this.mausPositionZuKoordinaten(this.breite, this.hoehe).x -x;
    const y2 = this.mausPositionZuKoordinaten(this.breite, this.hoehe).y -y;

    this.farbwaehlerBild.pop();
  },

  // Mausklicks verarbeiten ////////////////////////////////////////////////////
  mousePressed(x, y) {
    if (!worteinbettung.istInitialisiert) {
      return;
    }
    const farbe = this.farbwaehlerBild.get(x, y);
    const farbeAlsHex = rgbToHex(farbe);
    const wort = worteinbettung.farbeZuWortDict[farbeAlsHex];

    this.wortfeldA.removeClass("inputMarkiert");
    this.wortfeldB.removeClass("inputMarkiert");
    this.wortfeldC.removeClass("inputMarkiert");

    // Naja...
    if(this.gewaehltesWortfeld) {
      this.gewaehltesWortfeld.addClass("inputMarkiert")
    }


    if (wort) {
      this.gewaehltesWort = wort;
      worteinbettung.mischeReihenfolge();
      worteinbettung.wortZuVektorDict2D = schluesselAnsEnde(worteinbettung.wortZuVektorDict2D, wort);
      GUI.berichtUnten(worteinbettung.wortReport(wort), true);
      if (this.gewaehltesWortfeld) {
        this.gewaehltesWortfeld.value(wort);
      }
      return;
    } else {
      if (!this.mausInWorteinbettung(x, y)) {
        this.gewaehltesWort = undefined;
      }
    }
    
    if (this.mausInWorteinbettung(x, y)) {
      let skaliertePosition = this.mausPositionZuKoordinaten(x, y);
      this.deltaX = skaliertePosition.x;
      this.deltaY = skaliertePosition.y;
    } else {
      if (mouseX < 0) {
        // rechts neben Einbettung geklickt...
        // Wortfeld wird abgewählt.
        this.gewaehltesWortfeld = undefined;
      }
    }

    
    redraw();
  },

  mouseReleased() {
    if (this.deltaX) {
      let skalierteMausPosition = this.mausPositionZuKoordinaten(mouseX, mouseY);
      this.translationX = this.translationX + skalierteMausPosition.x - this.deltaX;
      this.translationY = this.translationY + skalierteMausPosition.y - this.deltaY;
      this.deltaX = undefined;
      this.deltaY = undefined;
    }
    redraw();
  },

  // Diverse Hilfsfunktionen ///////////////////////////////////////////////////

  mausInWorteinbettung(x, y) {
    return x > 0 &&
           x < this.breite &&
           y > 0 &&
           y < this.hoehe;
  },

  // Übersetzt die Mauskoordinaten abhängig von der aktuellen Skalierung
  // und Translation.
  mausPositionZuKoordinaten(x, y) {
    const xKoord = (x - this.translationX) / this.zoomSliderWert.value();
    const yKoord = (y - this.translationY) / this.zoomSliderWert.value();
    return {x: xKoord, y: yKoord}
  },

  // Schreibt ins obere Berichtsfeld. Wenn clear true ist, wird der
  // vorherige Inhalt überschrieben, sonst wird angehängt.
  berichtOben(text, clear=false) {
    if (text) {
      if (clear) {
        GUI.textMonitorOben.html(text + "\n");
      } else {
        const inhalt = GUI.textMonitorOben.value();
        GUI.textMonitorOben.html(inhalt + text + "\n");
      }
      return
    }
    const inhalt = GUI.textMonitorOben.value();
    GUI.textMonitorOben.html(inhalt + "\n");
  },

  // Schreibt ins untere Berichtsfeld. Wenn clear true ist, wird der
  // vorherige Inhalt überschrieben, sonst wird angehängt.
  berichtUnten(text, clear=false) {
    if (text) {
      if (clear) {
        GUI.textMonitorUnten.html(text + "\n");
      } else {
        const inhalt = GUI.textMonitorUnten.value();
        GUI.textMonitorUnten.html(inhalt + text + "\n");
      }
      return
    }
    const inhalt = GUI.textMonitorUnten.value();
    GUI.textMonitorUnten.html(inhalt + "\n");
  },

  leereBerichte() {
    GUI.textMonitorUnten.html("");
    GUI.textMonitorOben.html("");
  },

  leereBerichtOben() {
    GUI.textMonitorOben.html("");
  },

  leereBerichtUnten() {
    GUI.textMonitorUnten.html("");
  },

  // Callback für zoomSlider.mouseMoved()
  aktualisiereZoom() {
    const aufloesung = 100;
    const maxZoom = 30;
    this.zoomSliderWert.value(map(this.zoomSlider.value(), 0, aufloesung, 1, maxZoom));
    redraw();
  },

  // Callback für schriftgroesseSlider.mouseMoved()
  aktualisiereSchriftgroesse() {
    const aufloesung = 100;
    this.schriftgroesseWert.value(map(this.schriftgroesseSlider.value(),
                                      0, aufloesung,
                                      0.1, 
                                      this.maxSchriftgroesse));
    redraw();
  },

  reset() {
    this.leereBerichte();
    this.gewaehlteVokabel = undefined;
    this.resetZoom();
    this.resetSchriftgroesse();
    this.wortReset();
    this.wortfeldD.value("");
    if (worteinbettung) {
      worteinbettung.istInitialisiert = false;
      background(this.hintergrund);
      redraw();
    }
    // Die Wortfelder A-C werden nicht geleert, damit man die Leistungen
    // unterschiedlicher Einbettungen identischer Wörter miteinander vergleichen 
    // kann.
  },
    
  wortReset() {
    this.wortA = undefined;
    this.wortB = undefined;
    this.wortC = undefined;
    this.wortD = undefined;
  },

  wortfelderReset() {
    this.wortfeldA.value("");
    this.wortfeldB.value("");
    this.wortfeldC.value("");
    this.wortfeldD.value("");
    this.gewaehlteVokabel = undefined;
    this.gewaehltesWortfeld = undefined;
  },

  resetZoom() {
    this.zoomSlider.value(5);
    this.translationX = this.breite/2;
    this.translationY = this.hoehe/2;
    this.aktualisiereZoom();
  },

  resetSchriftgroesse() {
    const aufloesung = 100;
    this.schriftgroesseSlider.value(aufloesung/2);
    this.aktualisiereSchriftgroesse();
  }
  
}