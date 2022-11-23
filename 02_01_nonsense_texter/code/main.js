let textQuelle;
let markow;

function setup() {
  GUI.erzeugeGUI();
  markow = new Markow();
  textGewaehlt();
  smooth();
  noLoop();
}

// Callback-Funktion für GUI.textWaehler.changed()
function textGewaehlt() {
  GUI.textAusgabe.html("");
  GUI.lerneTextButton.attribute('disabled', '');
  GUI.erzeugeTextButton.attribute('disabled', '');
  ladeText("daten/" + GUI.textWaehler.value());
}

// Callback-Funktion für GUI.gradWaehler.changed()
function gradGewaehlt(){
  // textAusgabe leeren
  GUI.textAusgabe.html("");
  // Button "Text erzeugen" deaktivieren
  GUI.erzeugeTextButton.attribute('disabled', '');
}

// Lädt eine per pfad gegebene Textdatei in einen String
function ladeText(pfad) {
  // Die Textdatei unter pfad in ein String-Array laden und bei Erfolg
  // an die Callback-Funktion formatiereText() übergeben
  loadStrings(pfad, formatiereText);
  // Die entsprechende Callback-Funktion...
  function formatiereText(stringArray){
    // Alle Zeilen in einen String vereinigen
    textQuelle = stringArray.join("\n");
    // textQuelle aufräumen
    textQuelle = textQuelle.toLowerCase();
    textQuelle = entfernePaarigeZeichen(textQuelle);
    // Zeilenumbrüche durch "B" ersetzen
    textQuelle = textQuelle.replaceAll("\n", "B");
    // Button "Text lernen" aktivieren
    GUI.lerneTextButton.removeAttribute("disabled");
  }
}

// Callback-Funktion für GUI.lerneTextButton.mousePressed()
function lerneText() {
  // Text lernen
  markow.lerneText(textQuelle, int(GUI.gradWaehler.value()));
  // Übergangs-Tabelle in der textAusgabe anzeigen
  GUI.textAusgabe.html(markow.uebergaengeAlsString());
  // Button "Text erzeugen" aktivieren
  GUI.erzeugeTextButton.removeAttribute('disabled');
}
 
// Callback-Funktion für GUI.erzeugeTextButton.mousePressed()
function erzeugeText() {
  // Erste Zeichen der textQuelle auswählen
  const anfang = textQuelle.slice(0, int(GUI.gradWaehler.value()));
  // Nonsense Text generieren
  const generierterText = markow.erzeugeText(anfang, 500);
  // Generierten Text in die textAusgabe schreiben
  GUI.textAusgabe.html(generierterText);
}