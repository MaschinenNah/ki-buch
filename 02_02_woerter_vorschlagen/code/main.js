let textQuelle;
let markow;

// Lädt Text vor Aufruf der setup-Funktion
function preload() {
  textQuelle = loadStrings("daten/hofmannsthal.txt");
  // https://de.wikipedia.org/wiki/Ein_Brief_(Hofmannsthal)
}

function setup() {
  GUI.erzeugeGUI();
  markow = new Markow();
  // Alle Zeilen in einem String zusammenfassen
  textQuelle = textQuelle.join(" ");
  // textQuelle aufräumen
  textQuelle = textQuelle.toLowerCase();
  textQuelle = entferneSonderzeichen(textQuelle);
  textQuelle = entferneDoppelteLeerzeichen(textQuelle);
  // Text lernen
  markow.lerneText(textQuelle);
}

// Callback-Funktion für GUI.textEingabe.input()
function eingabe(){
  // Zuletzt eingegebenes Wort finden
  let letztes = letztesWort(this.value());
  // Wenn ein Wort gefunden wurde...
  if (letztes) {
    letztesWortVorhanden(letztes);
  }
  // textEingabe bereinigen
  aufraeumen(this);
}

// Diese Funktion wird immer ausgeführt, wenn der Inhalt von textFeld
// sich geändert hat und es ein letztes Wort gibt:
function letztesWortVorhanden(wort){
  loescheAlleWortEinfuegeKnoepfe();
  // Nach möglichen Anschlusswörtern suchen:
  const naechste = markow.wortVorschlaege(wort, 10);
  // Wenn Anschlusswörter vorhanden...
  if (naechste) {
    // ...für jedes Wort einen Knopf erzeugen
    naechste.forEach(erzeugeWortEinfuegeKnopf);
  } 
}

// Erzeugt für jedes aktuell mögliche Anschlusswort den entspechenden 
// Button zur Worteinfügung
function erzeugeWortEinfuegeKnopf(wort){
  const neuerKnopf = createButton(wort, wort);
  // Mit der Callback-Funktion verknüpfen
  neuerKnopf.mouseReleased(wortEinfuegen);
  // Neuen Knopf ins Array schieben
  GUI.wortEinfuegeKnoepfe.push(neuerKnopf);
}

// Löscht nach jeder Eingabe zunächst alle Buttons zur Worteinfügung
function loescheAlleWortEinfuegeKnoepfe(){
  GUI.wortEinfuegeKnoepfe.forEach(knopf => knopf.remove());
  GUI.wortEinfuegeKnoepfe = [];
}

// Callback-Funktion für alle wortEinfuegeKnoepfe
function wortEinfuegen(){
  // Das Wort, das eingefügt werden soll, ist der Wert des Knopfes
  const wort = this.value();
  // Inhalt der Textausgabe zwischenspeichern
  const str = GUI.textEingabe.value();
  // Neues Wort anhängen
  GUI.textEingabe.value(str + " " + wort + " ");
  // Das eingefügte Wort ist das neue letzte Wort
  letztesWortVorhanden(wort);
  // Fokus auf die textEingabe setzen
  GUI.textEingabe.elt.focus();
  // textEingabe bereinigen
  aufraeumen(GUI.textEingabe);
}

// Entfernt doppelte Leerzeichen und Leerzeichen vor Satzzeichen im 
// übergebenen p5Element. Wird für die Texteingabe aufgerufen, wann immer
// sich etwas geändert hat.
function aufraeumen(p5Element){
  let str = p5Element.value();
  str = str.toLowerCase();
  str = entferneDoppelteLeerzeichen(str);
  str = entferneLeerzeichenVorSatzzeichen(str);
  p5Element.value(str);
}