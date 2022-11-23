const GUI = {
  breite: undefined,
  ueberschrift: undefined,
  labelBildWaehler: undefined,
  bildWaehler: undefined,
  labelKernelWaehler: undefined,
  kernelWaehler: undefined,

  xOffset: 222,

  erzeugeGUI(){
    createCanvas(360, 790);
    textFont("monospace", 13);
    smooth();

    this.ueberschrift = createElement("h1", "Filterlabor I");

    // Drop-down Bild wählen
    this.labelBildWaehler = createElement("label", "Bild laden.....");
    this.labelBildWaehler.size(180, 25);
    this.bildWaehler = createSelect();
    this.bildWaehler.size(180, 40);
    this.bildWaehler.changed(bildGewaehlt);
    this.bildWaehler.option("muster01.png");
    this.bildWaehler.option("muster02.png");
    this.bildWaehler.option("muster03.png");
    this.bildWaehler.option("architektur01.png");
    this.bildWaehler.option("architektur02.png");
    this.bildWaehler.option("architektur03.png");
    this.bildWaehler.option("text01.png");
    this.bildWaehler.option("text02.png");
    this.bildWaehler.option("text03.png");
    this.bildWaehler.option("frauHutLinien.png");

    // 3x3 Kernel Kontrollfeld
    this.erzeugeKernelKontrollfeld();

    // Drop-down Kernel wählen
    this.labelKernelWaehler = createElement("label", "Kernel laden");
    this.labelKernelWaehler.size(180, 25);
    this.kernelWaehler = createSelect();
    this.kernelWaehler.size(180, 40);
    this.kernelWaehler.changed(kernelGewaehlt);
    this.kernelWaehler.option("Prewitt links");
    this.kernelWaehler.option("Prewitt rechts");
    this.kernelWaehler.option("Prewitt oben");
    this.kernelWaehler.option("Prewitt unten");
    this.kernelWaehler.option("Sobel waagerecht");
    this.kernelWaehler.option("Sobel senkrecht");
    this.kernelWaehler.option("Laplace");
    this.kernelWaehler.option("Relief");
    this.kernelWaehler.option("Scharfzeichnen");
    this.kernelWaehler.option("Weichzeichnen");
    this.kernelWaehler.value("Prewitt links");
    kernelGewaehlt();

    this.aktualisiereXOffset();
  },

  // Verknüpft GUI mit einem Filter
  setzeFilter(filter_) {
    this.filter = filter_;
    aktualisiereFilterObjekt();
    bildGewaehlt();
  },

  // Erzeugt Kernel-Kontrollfeld
  erzeugeKernelKontrollfeld(){
    for (let zeile = 0; zeile < 3; zeile++) {
      for (let spalte = 0; spalte < 3; spalte++) {
        const x = spalte * 50;
        const y = 415 + zeile * 30;
        this.erzeugeKernelGewichtWaehler(zeile, spalte, x, y)
      }
    }
  },

  // Erzeugt einen einzelnes Drop-down-Element im Kernel-Kontrollfeld
  erzeugeKernelGewichtWaehler(zeile, spalte, x, y) {
    const name = "zelle" + zeile + spalte;
    this[name] = createSelect();
    this[name].position(x, y);
    this[name].size(50, 30);
    this[name].changed(aktualisiereFilterObjekt.bind(this));
    this[name].option(-8);
    this[name].option(-5);
    this[name].option(-4);
    this[name].option(-2);
    this[name].option(-1);
    this[name].option(0);
    this[name].option(1);
    this[name].option(2);
    this[name].option(4);
    this[name].option(5);
    this[name].option(8);
    this[name].value(0);
  },

  // Positioniert Kernel-Kontrollfeld abhängig von xOffset
  positioniereKernelKontrollfeld(){
    for (let zeile = 0; zeile < 3; zeile++) {
      for (let spalte = 0; spalte < 3; spalte++) {
        const x = this.xOffset + spalte * 50;
        const y = 415 + zeile * 30;
        const name = "zelle" + zeile + spalte;
        this[name].position(x, y);
      }
    }
  },

  // Überträgt den gewählten Kernel auf das Kernel-Kontrollfeld
  ladeKernel(kernel) {
    for (let zeile = 0; zeile < 3; zeile++) {
      for (let spalte = 0; spalte < 3; spalte++) {
        const name = "zelle" + zeile + spalte;
        const wert = kernel.shift();
        this[name].value(wert);
      }
    }
  },

  zeichne(bildVorher, bildNachher) {
    bildVorher.zeichne(0, 60, 360, 270);
    bildNachher.zeichne(0, 510, 360, 270);
  },

  // Aktualisierung der Positionen aller DOM-Elemente bei resize.
  // Das geht vermutlich schöner.
  aktualisiereXOffset() {
    this.xOffset = (windowWidth/2) -width/2;
    if (windowWidth < width) {
      this.xOffset = 0;
    }
    this.ueberschrift.position(this.xOffset, -10);
    this.labelBildWaehler.position(this.xOffset, 360);
    this.bildWaehler.position(180 + this.xOffset, 360);
    this.labelKernelWaehler.position(180 + this.xOffset, 410);
    this.kernelWaehler.position(180 + this.xOffset, 450);
    this.positioniereKernelKontrollfeld()
  }
}

// Neue Positionierung der DOM-Elemente bei resize veranlassen
window.addEventListener("resize", () => GUI.aktualisiereXOffset());