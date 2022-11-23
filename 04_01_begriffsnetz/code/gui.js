const GUI = {
  
  ueberschrift: undefined,
  itemButtonA: undefined,
  itemButtonsB: undefined,
  transaktionsWaehler: undefined,
  matrixWaehler: undefined,
  nAssoziationenWaehler: undefined,
  zufallsButton: undefined,
  zeigeGewichteCheckbox: undefined,
  
  dRand: 10,
  hElement: 35,
  xOffset: undefined,

  erzeugeGUI(){
    createCanvas(1000, 700);
    background(113, 110, 165);

    this.itemButtonsB = [];

    this.ueberschrift = createElement("h1", "Begriffsnetz");

    // Drop-Down Transaktionsdatei
    this.transaktionsWaehler = createSelect();
    this.transaktionsWaehler.size(230, this.hElement);
    this.transaktionsWaehler.option("daten/zutaten01.txt");
    this.transaktionsWaehler.option("daten/zutaten02.txt");
    this.transaktionsWaehler.option("daten/absaetze.txt");
    this.transaktionsWaehler.option("daten/eigene.txt");
    this.transaktionsWaehler.value("daten/absaetze.txt");
    this.transaktionsWaehler.changed(transaktionsdateiGeaendert);
    
    // Drop-Down Kenngröße (Support, Confidence oder Lift)
    this.matrixWaehler = createSelect();
    this.matrixWaehler.size(230, this.hElement);
    this.matrixWaehler.option("supportAB");
    this.matrixWaehler.option("confidenceAB");
    this.matrixWaehler.option("liftAB");
    this.matrixWaehler.value("liftAB");
    this.matrixWaehler.changed(parameterGeaendert);

    // Drop-Down Anzahl Assoziationen
    this.nAssoziationenWaehler = createSelect();
    this.nAssoziationenWaehler.size(230, this.hElement);
    this.nAssoziationenWaehler.option(3);
    this.nAssoziationenWaehler.option(5);
    this.nAssoziationenWaehler.option(7);
    this.nAssoziationenWaehler.option(9);
    this.nAssoziationenWaehler.value(7);
    this.nAssoziationenWaehler.changed(parameterGeaendert);

    // Button zufälliges Item auswählen
    this.zufallsButton = createButton("Zufälliges Item");
    this.zufallsButton.size(230, this.hElement);
    this.zufallsButton.mousePressed(zufaelligesItem);

    // Checkbox Gewichte anzeigen
    this.zeigeGewichteCheckbox = createCheckbox(' Gewichte anzeigen', false);
    this.zeigeGewichteCheckbox.changed(parameterGeaendert);

    this.aktualisiereXOffset();
  },

  // Erzeugt den zentralen Button
  erzeugeItemButtonA(itemStringA, itemIdA) {
    if (this.itemButtonA != undefined) {
      this.itemButtonA.remove();
    }

    this.itemButtonA = createButton(itemStringA, itemIdA.toString());
    this.itemButtonA.style('font-size', "18px");
    const buttonBreite = this.itemButtonA.size().width;
    const buttonHoehe = this.itemButtonA.size().height;
    this.itemButtonA.position(width/2  + this.xOffset - buttonBreite/2,
                              height/2 - buttonHoehe/2);

    this.itemButtonA.mousePressed(itemButtonKlick);
  },

  // Erzeugt die Buttons mit den zu itemA (zentraler Button) assoziierten
  // Begriffen und zeichnet die Verbindungslinien
  erzeugeItemButtonsB(assoziationen) {
    background(113, 110, 165);
    this.itemButtonsB.forEach(button => button.remove());
    this.buttons = [];
    
    randomSeed(assoziationen[0].itemIdB)
    assoziationen = shuffle(assoziationen);
    
    let maxWeight = 0;
    let minWeight = 1000;

    assoziationen.forEach(assoziation => {
      if (assoziation.gewicht > maxWeight) {
        maxWeight = assoziation.gewicht;
      }
      if (assoziation.gewicht < minWeight) {
        minWeight = assoziation.gewicht;
      }
    });

    const nButtons = assoziationen.length;
    const schritt =  2*Math.PI / (nButtons);

    for (let buttonIdx=0; buttonIdx < nButtons; buttonIdx++) {
      const phase = schritt*buttonIdx;
      const gewicht = assoziationen[buttonIdx].gewicht;
      let distX, distY;
      if (minWeight != maxWeight) {
        distX = map(gewicht, minWeight, maxWeight, width/2.5, width/7);
        distY = map(gewicht, minWeight, maxWeight, height/2.5, height/7);
      } else {
        distX = width/4;
        distY = height/4;
      }
      const x = Math.sin(phase) * distX + width/2;
      const y = Math.cos(phase) * distY + height/2;
      
      let itemStringB;
      const item = assoziationen[buttonIdx];
      
      if (this.zeigeGewichteCheckbox.checked()) {
        itemStringB = assoziationen[buttonIdx].itemStringB + "<br>" + assoziationen[buttonIdx].gewicht.toFixed(5);
      } else {
        itemStringB = assoziationen[buttonIdx].itemStringB;
      }

      const neuerButton = createButton(itemStringB, assoziationen[buttonIdx].itemIdB.toString());
      neuerButton.style('font-size', "18px");

      const buttonBreite = neuerButton.width;
      const buttonHoehe = neuerButton.height;

      neuerButton.position(x - buttonBreite/2 + this.xOffset ,y - buttonHoehe/2);
      neuerButton.mousePressed(itemButtonKlick);

      this.itemButtonsB.push(neuerButton);
      
      if (this.matrixWaehler.value() == "liftAB" && gewicht > 1) {
        line(width/2, height/2, x, y);
      } else if (this.matrixWaehler.value() != "liftAB" && gewicht > 0) {
        line(width/2, height/2, x, y);
      }
    }
  },
  
  // Aktualisierung der Positionen aller DOM-Elemente bei resize.
  // Das geht vermutlich schöner.
  aktualisiereXOffset() {
    this.xOffset = (windowWidth/2) -width/2;
    if (windowWidth < width) {
      this.xOffset = 0;
    }
    this.ueberschrift.position(this.dRand + 700 + this.xOffset, -10);
    this.transaktionsWaehler.position(this.dRand + this.xOffset, 2*this.dRand);
    this.matrixWaehler.position(this.dRand + this.xOffset, 1*this.hElement + 3*this.dRand);
    this.nAssoziationenWaehler.position(this.dRand + this.xOffset, 2*this.hElement + 4*this.dRand);
    this.zufallsButton.position(this.dRand + this.xOffset, 3*this.hElement + 5*this.dRand);
    this.zeigeGewichteCheckbox.position(this.dRand + this.xOffset,  4*this.hElement + 6*this.dRand);
  }
}

// Neue Positionierung der DOM-Elemente bei resize veranlassen
window.addEventListener("resize", () => GUI.aktualisiereXOffset());
window.addEventListener("resize", () => parameterGeaendert());
