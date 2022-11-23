let zieheLosButton;
let xOffset;

// Ein Objekt, das die Anzahl der bisher vorgekommenen Ereignisse speichert
const ereignisse = {
  niete: 6,
  trostpreis: 3,
  gewinn: 1
};

function setup() {
  createCanvas(360, 200);
  background(95, 158, 160);

  textFont("monospace", 30);
  textAlign(CENTER);
  frameRate(10);
  
  zieheLosButton = createButton("Los ziehen");
  zieheLosButton.size(275, 50);
  zieheLosButton.mousePressed(zieheLos);
  aktualisiereXOffset();
}

function draw() {
  fill(113, 110, 165, 30);
  rect(0, 0, width, height);
}

function zieheLos() {
  background(95, 158, 160);
  const los = gewichteterZufall(ereignisse);
  fill(0);
  text(los, 180, 150);
}

// Reproduziert die Häufigkeiten in ereignisse, sprich: wenn diese Funktion
// oft genug aufgerufen wird, dann liefert sie in 60 von 100 Fällen eine 
// Niete etc.
function gewichteterZufall(ereignisse) {
  let nEreignisse = 0;

  for(let ereignis in ereignisse) {
    nEreignisse += ereignisse[ereignis];
  }

  const zufallszahl = Math.random() * nEreignisse;
  let summe = 0;
  
  for(let ereignis in ereignisse ) {
    summe += ereignisse[ereignis];
    if (summe >= zufallszahl) {
      return ereignis;
    }
  }
}

// Aktualisierung der Position des Buttons bei resize.
function aktualisiereXOffset() {
  xOffset = (windowWidth/2) -width/2;
  if (windowWidth < width) {
    xOffset = 0;
  }
  zieheLosButton.position(50 + xOffset, 50);
}

// Neue Positionierung der DOM-Elemente bei resize veranlassen
window.addEventListener("resize", () => aktualisiereXOffset());