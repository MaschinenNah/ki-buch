// Lädt die Bilddateien bei Programmstart
function preload() {
  GUI.ladeSprites();
}

function setup(){
  GUI.erzeugeGUI();
}

function draw() {
  background(46,139,87);
  // Wenn die Maus im Spielfeld ist...
  if (GUI.mausIstImSpielfeld()) {
    // Datenpunkt abhängig von Mausposition erzeugen...
    const datenpunkt = GUI.mausPositionZuDatenpunkt();
    // Aktivierungen berechnen...
    const haeschen = istHaeschen(datenpunkt.flauschigkeit,
                                 datenpunkt.niedlichkeit);
    const igel = istIgel(datenpunkt.flauschigkeit,
                         datenpunkt.niedlichkeit);
    const hai = istHai(datenpunkt.flauschigkeit,
                       datenpunkt.niedlichkeit);
    const vogelspinne = istVogelspinne(datenpunkt.flauschigkeit,
                                       datenpunkt.niedlichkeit);
    
    const ausgaben = {haeschen: haeschen,
                      igel: igel,
                      hai: hai,
                      vogelspinne: vogelspinne}

    // Zeichnen...
    GUI.zeichne(ausgaben);
  } else {
    GUI.zeichne();
  }
}