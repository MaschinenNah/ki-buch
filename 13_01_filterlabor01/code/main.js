let bildVorher;
let bildNachher;
let filter_;

function setup(){
  GUI.erzeugeGUI();
  bildVorher = new Bild();
  bildNachher = new Bild();
  filter_ = new Filter();
  GUI.setzeFilter(filter_);
  GUI.zeichne(bildVorher, bildNachher);
}

// Callback-Funktion für GUI.kernelWaehler.changed()
function kernelGewaehlt(){
  switch(GUI.kernelWaehler.value()) {
    case "Prewitt links":
      GUI.ladeKernel([1, 0, -1, 1, 0, -1, 1, 0, -1]);
      break;
    case "Prewitt rechts":
      GUI.ladeKernel([-1, 0, 1, -1, 0, 1, -1, 0, 1]);
      break;
    case "Prewitt oben":
      GUI.ladeKernel([1, 1, 1, 0, 0, 0, -1, -1, -1]);
      break;
    case "Prewitt unten":
      GUI.ladeKernel([-1, -1, -1, 0, 0, 0, 1, 1, 1]);
      break;
    case "Sobel waagerecht":
      GUI.ladeKernel([1, 2, 1, 0, 0, 0, -1, -2, -1]);
      break;
    case "Sobel senkrecht":
      GUI.ladeKernel([1, 0, -1, 2, 0, -2, 1, 0, -1]);
      break;
    case "Laplace 45 Grad":
      GUI.ladeKernel([1, 1, 1, 1, -8, 1, 1, 1, 1]);
      break;
    case "Relief":
      GUI.ladeKernel([-2, -1, 0, -1, 1, 1, 0, 1, 2]);
      break;
    case "Scharfzeichnen":
      GUI.ladeKernel([0, -1, 0, -1, 5, -1 ,0, -1, 0]);
      break;
    case "Weichzeichnen":
      GUI.ladeKernel([1, 1, 1, 1, 1, 1, 1, 1, 1]);
      break; 
    case "Weichzeichnen Gauss":
      GUI.ladeKernel([1, 2, 1, 2, 4, 2, 1, 2, 1]);
      break; 
  }
  aktualisiereFilterObjekt();
}

// Callback-Funktion für GUI.kernelWaehler.changed()
function bildGewaehlt() {
  const pfad = "daten/" + GUI.bildWaehler.value();
  bildVorher.lade(pfad, filterAnwenden);
}

// Aktualisiert das Filter-Objekt nach Änderung des Kontrollfelde
function aktualisiereFilterObjekt() {
  if (!filter_) {
    return;
  }
  filter_.kernel = [];
  for (let zeile = 0; zeile < 3; zeile++) {
    for (let spalte = 0; spalte < 3; spalte++) {
      const name = "zelle" + zeile + spalte;
      filter_.kernel.push(float(GUI[name].value()));
    }
  }
  filterAnwenden();
}

function filterAnwenden() {
  if (bildVorher.pImage) {
    bildNachher = filter_.filterAnwenden(bildVorher);
    zeichne();
  }
}

function zeichne() {
  GUI.zeichne(bildVorher, bildNachher);
}