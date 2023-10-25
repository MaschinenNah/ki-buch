// Objekte dieser Klasse repräsentieren eine Sequenzeinbettung.
// Eine Sequenzeinbettung ordnet einer Sequenz (einer Folge von Wörtern) eine 
// Korrdinate (bwz. einen Vektor) in einem hochdimensionalen Raum zu.

// Grundlage dieser Zuordnung ist eine Worteinbettung.
// Der Sequenzvektor eines Satzes ist in dem hier gewählten, einfachen Verfahren
// schlichtweg der Mittelwert der Wortvektoren in der gebenen Einbettung.

class Sequenzeinbettung {

  constructor(worteinbettung) {
    this.worteinbettung = worteinbettung;

    this.sequenzVektoren = undefined;
    this.sequenzVektoren2D = undefined;

    // Dicts, das jeder Sequenz eine zufällige Farbe zuordnet.
    // Wird für die Auswahl von Sequenzen per Mausklick benötigt.
    this.farbeZuSequenzDict = undefined;
    this.normalisierer = undefined;
  }

  // Wird aufgerufen, nachdem eine Einbettung geladen wurde...
  initialisiere() {
    let zeilen = this.worteinbettung.zeilenOhneDoppelte;
    // Wir nutzen nur die ersten 1000 Zeilen, weil für jede Zeile ein Kreis
    // gerendert werden muss:
    zeilen = zeilen.slice(0, 1000);
    this.sequenzVektoren = [];
    this.sequenzVektoren2D = [];
    this.farbeZuSequenzDict = {};

    for (let zeile of zeilen) {
      const vektor = this.sequenzZuVektor(zeile);
      this.sequenzVektoren.push({vektor:vektor, zeile:zeile});
      const vektor2D = this.sequenzZuVektor2D(zeile);
      const farbe = erzeugeZufallsFarbe(0.9);
      this.farbeZuSequenzDict[farbe] = zeile;
      this.sequenzVektoren2D.push({vektor:vektor2D, zeile:zeile, farbe:farbe});
    }

    this.normalisierer = erzeugeNormalisierer(this.sequenzVektoren2D, -100, 100);

    for (let sequenzVektor2D of this.sequenzVektoren2D) {
      let vektor = sequenzVektor2D.vektor;
      vektor = this.normalisierer(vektor);
      sequenzVektor2D.vektor = vektor;
    }

    this.nSequenzen = zeilen.length;
    this.istInitialisiert = true;
    setTimeout(() => redraw(), 500);
  }

  // Schnittstelle: Liefert den Vektor zu einer Sequenz.
  sequenzZuVektor(sequenzAlsString) {
    const sequenzAlsStringArray = sequenzAlsString.split(" ");
    const sequenzLaenge = sequenzAlsStringArray.length
    const sequenzAlsVektorArray = sequenzAlsStringArray.map((string) => this.worteinbettung.zuVektor(string))
    let resultat = summiereVektoren(sequenzAlsVektorArray);
    resultat = teileVektor(resultat, sequenzLaenge);
    return resultat;
  }

  // Schnittstelle: Liefert den dimensionsreduzierten Vektor zu einer Sequenz.
  sequenzZuVektor2D(sequenzAlsString) {
    const sequenzAlsStringArray = sequenzAlsString.split(" ");
    const sequenzLaenge = sequenzAlsStringArray.length
    const sequenzAlsVektorArray = sequenzAlsStringArray.map((string) => this.worteinbettung.zuVektor2D(string))
    let resultat = summiereVektoren(sequenzAlsVektorArray);
    resultat = teileVektor(resultat, sequenzLaenge);
    return resultat;
  }

  // Schnittstelle: Liefert die Kosinus-Ähnlichkeit zwischen zwei Sequenzen.
  sequenzVergleich(sequenzAlsString01, sequenzAlsString02) {
    const embedding01 = this.sequenzZuVektor(sequenzAlsString01);
    const embedding02 = this.sequenzZuVektor(sequenzAlsString02);
    const aehnlichkeit = kosinusAehnlichkeit(embedding01, embedding02);
    return aehnlichkeit;
  }

  // Schnittstelle: Mischt die Reihenfolge der Einträge in
  // sequenzVektoren2D. Dient der grafischen Darstellung. Damit nicht
  // immer dieselben Sequenzen vorne sind.
  mischeReihenfolge() {
    this.sequenzVektoren2D = mischeArray(this.sequenzVektoren2D);
  }


}






/*   sequenzZuVektorNormiertUndGewichtet(sequenzAlsString) {
    const sequenzAlsStringArray = sequenzAlsString.split(" ");
    const sequenzLaenge = sequenzAlsStringArray.length;
    const sequenzAlsVektorArray = [];
    for (let wort of sequenzAlsStringArray) {
      const vektor = this.worteinbettung.zuVektor(wort);
      const haeufigkeit = this.worteinbettung.wortZuHaeufigkeitDict[wort];
      let gewicht;
      if (haeufigkeit) {
        gewicht = 1.0 / haeufigkeit;
      } else {
        gewicht = 0;
      }
      //console.log("wort gewicht:", wort, gewicht)
      const gewichteterVektor = multipliziereVektor(vektor, gewicht);
      sequenzAlsVektorArray.push(gewichteterVektor);
    }

    let resultat = summiereVektoren(sequenzAlsVektorArray);
    resultat = teileVektor(resultat, sequenzLaenge);
    return resultat;
  }
 */

/*   sequenzVergleichNormiertUndGewichtet(sequenzAlsString01, sequenzAlsString02) {
    const embedding01 = this.sequenzZuVektorNormiertUndGewichtet(sequenzAlsString01);
    const embedding02 = this.sequenzZuVektorNormiertUndGewichtet(sequenzAlsString02);
    const aehnlichkeit = kosinusAehnlichkeit(embedding01, embedding02);
    return aehnlichkeit;
  }

  sequenzVergleich(sequenzAlsString01, sequenzAlsString02) {
    const nichtGewichtet = this.sequenzVergleichNormiert(sequenzAlsString01, sequenzAlsString02);
    const gewichtet = this.sequenzVergleichNormiertUndGewichtet(sequenzAlsString01, sequenzAlsString02);
    console.log("nicht gewichtet", nichtGewichtet);
    console.log("gewichtet", gewichtet); 


  }*/