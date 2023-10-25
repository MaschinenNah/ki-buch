const GUI = {
  breite: undefined,
  hoehe: undefined,
  skalierung: 1,
  translationX: 0,
  translationY: 0,
  deltaX: undefined,
  deltaY: undefined,

  hintergrund: 220,
  schrittHelligkeitStart: 140,
  schrittHelligkeitRange: 115,

  canvas: undefined,
  einbettungsWaehler: undefined,
  wortOderSequenzWaehler: undefined,
  zoomSlider: undefined,
  zoomSliderWert: undefined,
  zoomResetButton: undefined,
  schriftgroesseSlider: undefined,
  schriftgroesseWert: undefined,
  maxSchriftGroesse: 4,
  
  sequenzfeldA: undefined,
  sequenzfeldB: undefined,
  sequenzfeldC: undefined,

  gewaehltesSequenzfeld: undefined,

  sequenzA: "",
  sequenzB: "",
  sequenzC: "",
  
  textMonitorOben: undefined,
  textMonitorUnten: undefined,

  gewaehlteSequenz: undefined,

  divLinks: undefined,
  divRechts: undefined,
  divGesamt: undefined,

  // Das farbwaehlerBild doppelt die sichtbare Darstellung der Einbettung.
  // Hier wird aber jede Sequenz in einer zufällig gewählten, eindeutigen Farbe
  // Dargestellt. Dies dient der Auswahl einer Sequenz per Mausklick. Der Klick
  // wird auf das Farbwählerbild übertragen, und die Farbe des getroffenen
  // Pixels identifiziert die angeklickte Sequenz.
  farbwaehlerBild: undefined,

  erzeugeGUI(){
    this.breite = 600;
    this.hoehe = 500
    this.translationX = this.breite/2;
    this.translationY = this.hoehe/2;

    this.divLinks = createDiv();
    this.divLinks.style('background', 'rgb(255, 211, 129)');
    this.divLinks.style('border', '5px solid rgb(255, 211, 129)');
    this.divLinks.style('width', '600px');

    this.divRechts = createDiv();
    this.divRechts.style('border', '5px solid rgb(255, 211, 129)');
    this.divRechts.style('width', '400px');

    this.divGesamt = createDiv();
    this.divGesamt.style('border', '5px solid rgb(255, 211, 129)');
    this.divGesamt.child(this.divLinks);
    this.divGesamt.child(this.divRechts);
    this.divGesamt.style('display', 'flex');

    createElement("label", "Einbettungsraum")
      .parent(this.divLinks);
    this.canvas = createCanvas(this.breite, this.hoehe);
    this.canvas.parent(this.divLinks);
    this.canvas.mouseMoved(() => redraw());
    textFont("monospace", 1);
    background(this.hintergrund);
  
    createElement("br")
      .parent(this.divLinks);

    createElement("label", "Zoom..........")
      .parent(this.divLinks);
    const aufloesung = 100;
    this.zoomSlider = createSlider(0, aufloesung, 5);
    this.zoomSlider.parent(this.divLinks);
    this.zoomSlider.addClass("slider");
    this.zoomSlider.mouseMoved(() => this.aktualisiereZoom());
    this.zoomSliderWert = createInput();
    this.zoomSliderWert.parent(this.divLinks);
    this.zoomSliderWert.addClass("inputSchmal");
    this.aktualisiereZoom();

    this.zoomResetButton = createButton("zurücksetzen").parent(this.divLinks);
    this.zoomResetButton.mousePressed(()=> this.resetZoom())
    
    createElement("label", "Elementgroesse").parent(this.divLinks);
    this.schriftgroesseSlider = createSlider(0, aufloesung, aufloesung*0.75);
    this.schriftgroesseSlider.parent(this.divLinks);
    this.schriftgroesseSlider.addClass("slider");
    this.schriftgroesseSlider.mouseMoved(() =>this.aktualisiereSchriftgroesse());
    this.schriftgroesseWert = createInput();
    this.schriftgroesseWert.parent(this.divLinks);
    this.schriftgroesseWert.addClass("inputSchmal");
    this.schriftgroesseWert.value(map(this.schriftgroesseSlider.value(), 
                                      0, aufloesung, 
                                      0.1, 
                                      this.maxSchriftGroesse));
                        
    this.schriftgroesseResetButton = createButton("zurücksetzen");
    this.schriftgroesseResetButton.parent(this.divLinks);
    this.schriftgroesseResetButton.mousePressed(() => this.resetSchriftgroesse());

    createElement("label", "Sequenz A")
      .parent(this.divLinks)
      .addClass("labelSequenz");
    createElement("label", "Sequenz B")
      .parent(this.divLinks)
      .addClass("labelSequenz");
    createElement("label", "Sequenz C")
      .parent(this.divLinks)
      .addClass("labelSequenz");
    // TODO: read only setzen!
    this.sequenzfeldA = createElement("textarea");
    this.sequenzfeldA.parent(this.divLinks);
    this.sequenzfeldA.addClass("inputBreit");
    this.sequenzfeldA.mousePressed(() => this.gewaehltesSequenzfeld = this.sequenzfeldA);

    this.sequenzfeldB = createElement("textarea");
    this.sequenzfeldB.parent(this.divLinks);
    this.sequenzfeldB.addClass("inputBreit");
    this.sequenzfeldB.mousePressed(() => this.gewaehltesSequenzfeld = this.sequenzfeldB);

    this.sequenzfeldC = createElement("textarea");
    this.sequenzfeldC.parent(this.divLinks);
    this.sequenzfeldC.addClass("inputBreit");
    this.sequenzfeldC.mousePressed(() => this.gewaehltesSequenzfeld = this.sequenzfeldC);

    createElement("label", "Einbettung laden.............")
      .parent(this.divLinks)
      .addClass("labelBreit");
    this.einbettungsWaehler = createSelect();
    this.einbettungsWaehler.parent(this.divLinks);
    this.einbettungsWaehler.addClass("selectBreit");
    this.einbettungsWaehler.option("berufe01");
    this.einbettungsWaehler.option("berufe02");
    this.einbettungsWaehler.option("berufe03");
    this.einbettungsWaehler.option("katzenstein");
    this.einbettungsWaehler.value("katzenstein");
    this.einbettungsWaehler.changed(einbettungGewaehlt);

    createElement("label", "Bericht Einbettung")
      .parent(this.divRechts)
      .addClass("labelBreit");
    this.textMonitorOben = createElement('textarea');
    this.textMonitorOben.parent(this.divRechts);
    this.textMonitorOben.addClass("textareaOben");
    this.textMonitorOben.attribute('disabled', '');
    
    createElement("label", "Bericht Sequenzen")
      .parent(this.divRechts)
      .addClass("labelBreit");
    this.textMonitorUnten = createElement('textarea').parent(this.divRechts); 
    this.textMonitorUnten.attribute('disabled', '');

    this.farbwaehlerBild = createGraphics(this.breite, this.hoehe);
  },

  // TODO: Diese Funktion ist viel zu umfangreich, und sollte aufgeteilt werden
  zeichneSequenzeinbettung(sequenzeinbettung) {
    background(this.hintergrund);
    this.farbwaehlerBild = createGraphics(this.breite, this.hoehe);

    // Sequenz A, B und C //////////////////////////////////////////////////////
    if (this.sequenzA != "" && this.sequenzB != "" && this.sequenzC != "") {
      const AzuB = sequenzeinbettung.sequenzVergleich(this.sequenzA, this.sequenzB);
      const AzuC = sequenzeinbettung.sequenzVergleich(this.sequenzA, this.sequenzC);
      const BzuC = sequenzeinbettung.sequenzVergleich(this.sequenzB, this.sequenzC);
      this.berichtUnten("KOSINUS-ÄHNLICHKEITEN", true)
      this.berichtUnten();
      this.berichtUnten("Zwischen Sequenz A und Sequenz B:\n" + AzuB.toFixed(3));
      this.berichtUnten();
      this.berichtUnten("Zwischen Sequenz A und Sequenz C:\n" + AzuC.toFixed(3));
      this.berichtUnten();
      this.berichtUnten("Zwischen Sequenz B und Sequenz C:\n" + BzuC.toFixed(3));

    } else if (this.sequenzA != "" && this.sequenzB != "") {
      const AzuB = sequenzeinbettung.sequenzVergleich(this.sequenzA, this.sequenzB);
      this.berichtUnten("KOSINUS-ÄHNLICHKEITEN", true)
      this.berichtUnten();
      this.berichtUnten("Zwischen Sequenz A und Sequenz B:\n" + AzuB.toFixed(3));

    } else if (this.sequenzA != "" && this.sequenzC != "") {
      const AzuC = sequenzeinbettung.sequenzVergleich(this.sequenzA, this.sequenzC);
      this.berichtUnten("KOSINUS-ÄHNLICHKEITEN", true)
      this.berichtUnten();
      this.berichtUnten("Zwischen Sequenz A und Sequenz C:\n" + AzuC.toFixed(3));


    } else if (this.sequenzB != "" && this.sequenzC != "") {
      const BzuC = sequenzeinbettung.sequenzVergleich(this.sequenzB, this.sequenzC);
      this.berichtUnten("KOSINUS-ÄHNLICHKEITEN", true)
      this.berichtUnten();
      this.berichtUnten("Zwischen Sequenz B und Sequenz C:\n" + BzuC.toFixed(3));
    }


    // Lupenkreis //////////////////////////////////////////////////////////////
    noFill();
    stroke(0);
    strokeWeight(1);
    circle(this.breite/2, this.hoehe/2, 100);
    fill(0);
    stroke(0);
    this.farbwaehlerBild.noStroke();
    this.farbwaehlerBild.fill(255);

    // Skalierung und Transformation ///////////////////////////////////////////
    this.farbwaehlerBild.push();
    const zentrumX = this.breite/2;
    const zentrumY = this.hoehe/2;
    const zoom = GUI.zoomSliderWert.value();

    if (this.deltaX) {

      translate(zentrumX, zentrumY);
      scale(zoom);
      translate(-zentrumX, -zentrumY);
      this.farbwaehlerBild.translate(zentrumX, zentrumY);
      this.farbwaehlerBild.scale(zoom);
      this.farbwaehlerBild.translate(-zentrumX, -zentrumY);

      let skalierteMausPosition = this.mausPositionZuKoordinaten(mouseX, mouseY);

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
      translate(this.translationX, this.translationY);

      this.farbwaehlerBild.translate(zentrumX, zentrumY);
      this.farbwaehlerBild.scale(zoom);
      this.farbwaehlerBild.translate(-zentrumX, -zentrumY);
      this.farbwaehlerBild.translate(this.translationX, this.translationY);
    }

    const elementGroesse = map(zoom,
                               0.0,
                               30.0,
                               8*GUI.schriftgroesseWert.value(),
                               4*GUI.schriftgroesseWert.value());
    textSize(elementGroesse);
    textAlign(CENTER);
    this.farbwaehlerBild.textSize(elementGroesse*1.1);
    this.farbwaehlerBild.textAlign(CENTER);

    // Embedding zeichnen //////////////////////////////////////////////////////
    const nSequenzen = sequenzeinbettung.nSequenzen;

    const farbschritt = this.schrittHelligkeitRange / nSequenzen;
    let schrittfarbe = this.schrittHelligkeitStart;

    const sequenzen = sequenzeinbettung.sequenzVektoren2D;
    
    for (let sequenz of sequenzen) {
      schrittfarbe += farbschritt;
      const zeile = sequenz.zeile;
      let x = sequenz.vektor[0];
      let y = sequenz.vektor[1];
      const farbe = sequenz.farbe;
      fill(255);
      strokeWeight(elementGroesse*0.02)
      stroke(0);
      circle(x, y, elementGroesse*0.5);

      this.farbwaehlerBild.noStroke();
      this.farbwaehlerBild.fill(farbe);
      this.farbwaehlerBild.circle(x, y, elementGroesse*0.8);
    }

    if (this.sequenzA !="") {
      let vektorA = sequenzeinbettung.sequenzZuVektor2D(this.sequenzA);
      vektorA = sequenzeinbettung.normalisierer(vektorA);
      const x = vektorA[0];
      const y = vektorA[1];
      fill(255);
      stroke(0);
      strokeWeight(elementGroesse*0.01);
      circle(x, y, elementGroesse);
      fill(0);
      textAlign(CENTER, CENTER);
      noStroke();
      text("A", x, y);
    }

    if (this.sequenzB !="") {
      let vektorB = sequenzeinbettung.sequenzZuVektor2D(this.sequenzB);
      vektorB = sequenzeinbettung.normalisierer(vektorB);
      const x = vektorB[0];
      const y = vektorB[1];
      fill(255);
      stroke(0);
      strokeWeight(elementGroesse*0.01);
      circle(x, y, elementGroesse);
      fill(0);
      textAlign(CENTER, CENTER);
      noStroke();
      text("B", x, y);
    }

    if (this.sequenzC !="") {
      let vektorC = sequenzeinbettung.sequenzZuVektor2D(this.sequenzC);
      vektorC = sequenzeinbettung.normalisierer(vektorC);
      const x = vektorC[0];
      const y = vektorC[1];
      fill(255);
      stroke(0);
      strokeWeight(elementGroesse*0.01);
      circle(x, y, elementGroesse);
      fill(0);
      textAlign(CENTER, CENTER);
      noStroke();
      text("C", x, y);
    }

    this.farbwaehlerBild.pop();
  },

  // Mausklicks verarbeiten ////////////////////////////////////////////////////
  mousePressed(x, y) {
    if (!sequenzeinbettung.istInitialisiert) {
      return;
    }

    const farbe = this.farbwaehlerBild.get(x, y);
    const farbeAlsHex = rgbToHex(farbe);
    const sequenz = sequenzeinbettung.farbeZuSequenzDict[farbeAlsHex];

    // Naja...

    this.sequenzfeldA.removeClass("inputMarkiert");
    this.sequenzfeldB.removeClass("inputMarkiert");
    this.sequenzfeldC.removeClass("inputMarkiert");

    if(this.gewaehltesSequenzfeld) {
      this.gewaehltesSequenzfeld.addClass("inputMarkiert")
    }

    if (sequenz) {
      this.gewaehlteSequenz = sequenz;
      const gereinigteSequenz = entferneLeerzeichenVorSatzzeichen(sequenz);
      this.leereBerichtUnten();

      this.berichtUnten(gereinigteSequenz, true);
      const match = findeErstenTreffer(sequenzeinbettung.sequenzVektoren2D,
                                       element => element.zeile == sequenz);
      sequenzeinbettung.sequenzVektoren2D = entferneErstenTreffer(
        sequenzeinbettung.sequenzVektoren2D, 
        element => element.zeile == sequenz);
      sequenzeinbettung.mischeReihenfolge();
      sequenzeinbettung.sequenzVektoren2D.push(match);

      if (this.gewaehltesSequenzfeld) {
        this.gewaehltesSequenzfeld.value(gereinigteSequenz);
        if (this.gewaehltesSequenzfeld == this.sequenzfeldA) {
          this.sequenzA = sequenz;
        }
        if (this.gewaehltesSequenzfeld == this.sequenzfeldB) {
          this.sequenzB = sequenz;
        }
        if (this.gewaehltesSequenzfeld == this.sequenzfeldC) {
          this.sequenzC = sequenz;
        }
        
      }
    } else {
        if (this.mausInSequenzeinbettung(x, y)) {
          let skaliertePosition = this.mausPositionZuKoordinaten(x, y);
          this.deltaX = skaliertePosition.x;
          this.deltaY = skaliertePosition.y;
        } else {
            // links neben Einbettung geklickt...
            // Sequenzfeld wird abgewählt
            if (mouseX < 0) {
              this.gewaehlteSequenz = undefined;
              this.gewaehltesSequenzfeld = undefined;
              this.sequenzfeldA.removeClass("inputMarkiert");
              this.sequenzfeldB.removeClass("inputMarkiert");
              this.sequenzfeldC.removeClass("inputMarkiert");
            }
            // rechts neben Einbettung geklickt...
            // Sequenzfeld wird abgewählt.
            // Sequenzfelder werden geleert.
            // Bericht Sequenzen wird geleert.
            if (mouseX > this.breite) {
              this.gewaehlteSequenz = undefined;
              this.gewaehltesSequenzfeld = undefined;
              this.sequenzA = "";
              this.sequenzB = "";
              this.sequenzC = "";
              this.sequenzfeldA.value("");
              this.sequenzfeldB.value("");
              this.sequenzfeldC.value("");
              this.sequenzfeldA.removeClass("inputMarkiert");
              this.sequenzfeldB.removeClass("inputMarkiert");
              this.sequenzfeldC.removeClass("inputMarkiert");
              this.leereBerichtUnten();
            }
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

  mausInSequenzeinbettung(x, y) {
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
    this.schriftgroesseWert.value(map(this.schriftgroesseSlider.value(), 0, aufloesung, 0.1, this.maxSchriftGroesse)) ;
    redraw();
  },

  reset() {
    //this.leereBerichte();
    this.sequenzfeldA.value("")
    this.sequenzfeldB.value("")
    this.sequenzfeldC.value("")
    this.sequenzA = "";
    this.sequenzB = "";
    this.sequenzC = "";
    this.resetZoom();
    this.resetSchriftgroesse();
  },

  resetZoom() {
    this.zoomSlider.value(5);
    this.translationX = this.breite/2;
    this.translationY = this.hoehe/2;
    this.aktualisiereZoom();
  },

  resetSchriftgroesse() {
    const aufloesung = 100;
    this.schriftgroesseSlider.value(aufloesung*0.25);
    this.aktualisiereSchriftgroesse();
  }
  
}