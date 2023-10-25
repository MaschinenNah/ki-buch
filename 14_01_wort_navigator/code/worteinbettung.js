// Objekte dieser Klasse repräsentieren eine Worteinbettung.
// Eine Worteinbettung ordnet jedem bekannten Wort eine Korrdinate (bwz.
// einen Vektor) in einem hochdimensionalen Raum zu.

// Die Worteinbettung wird aus mehreren Dateien geladen.
// Im vorliegenden Projekt befinden sich die Dateien im Verzeichnis daten.
// Die Unterverzeichnisse enthalten jeweils alle Dateinen zu einer Einbettung:

// vektoren.json
// Ein Dict, dessen Schlüssel Wörter und dessen Werte hochdimensionale Vektoren 
// sind.

// vektoren2D.json
// Wie vektoren.json, nur, dass hier die Verktoren zweidimensional sind. Dies 
// dient der grafischen Darstellung. Die Dimensionsreduktion wurde mit dem 
// tSNE-Verfahren gemacht.

// metadaten.json
// Im vorliegenden Projekt ist das ein Dict, das zu jedem Wort die absolute
// Häufigkeit in den Textbeispielen speichert, aus denen die Einbettung
// berechnet wurde. Daraus werden relative Häufigkeiten berechnet, die
// aktuell nur angezeigt werden bei Auswahl des Wortes. Die Werte könnten
// für die Gewichtung in Sequenzvektoren verwendet werden.

// zeilen.txt
// Textbeispiele, aus denen die Einbettung berechnet wurde. Bei sehr großen
// Textmengen kann das nur eine Auswahl sein.

// qualitaet.txt
// Hier steht im vorliegenden Projekt eine Auswertung der Qualität einer
// Einbettung, sprich: wie treffsicher sind bestimmte Relationstransformationen?

// notizen.txt
// Hier können z.B die Metaparameter des Neuronalen Netzes stehen, das die 
// Einbettung berechnet hat.

class Worteinbettung {

  constructor(wortZuVektorDict, wortZuVektorDict2D, metadaten, kommentar, zeilen) {
    this.istInitialisiert = false;

    // Vektoren der Worteinbettung
    this.wortZuVektorDict = wortZuVektorDict;
    // Vektoren der Worteinbettung, dimensionsreduziert
    this.wortZuVektorDict2D = wortZuVektorDict2D;
    // Metadaten und Kommentare zur Einbettung
    this.metadaten = metadaten;
    this.kommentar = kommentar;

    // Textquelle:
    // alle Zeilen
    this.zeilen = zeilen;
    // Anzahl Wörter
    this.nWoerter = undefined;
    // alle Vokabeln
    this.vokabular = undefined;
    // Anzahl Vokabeln
    this.nVokabeln = undefined;
    // Anzahl Einbettungsdimensionen
    this.nDimensionen = undefined;
    // Nur an dieser Stelle unterschieden wir zwischen Wörtern und Vokabeln.
    
    // Dicts, die jedem Wort eine zufällige Farbe zuordnen.
    // Werden für die Auswahl von Wörtern per Mausklick benötigt.
    this.wortZuFarbeDict = undefined;
    this.farbeZuWortDict = undefined;

    // Dict, dass jedem Wort eine relative Häufigkeit zuordnet,
    this.wortZuHaeufigkeitDict = undefined;

  }
    

  // Wird aufgerufen, nachdem eine Einbettung geladen wurde...
  initialisiere() {
    this.wortZuFarbeDict = {};
    
    this.vokabular = Object.keys(this.wortZuVektorDict2D);

    this.nVokabeln = this.vokabular.length;
    

    for (let wort of this.vokabular) {
      this.wortZuFarbeDict[wort] = erzeugeZufallsFarbe(0.9);
    }
    this.farbeZuWortDict = invertiereDict(this.wortZuFarbeDict);
    this.nDimensionen = this.wortZuVektorDict[this.vokabular[0]].length;
  
    this.nWoerter = this.zeilen.join(" ").split(" ").length;
    this.wortZuHaeufigkeitDict = {}
    for (let wort of this.vokabular) {
      const haeufigkeit =  this.metadaten[wort] / this.nWoerter;
      this.wortZuHaeufigkeitDict[wort] = haeufigkeit;
    }

    this.wortZuVektorDict2D = skaliereWerte(this.wortZuVektorDict2D, -100, 100);
    this.mischeReihenfolge();


    
    this.istInitialisiert = true;

    GUI.berichtOben("Worteinbettung '" + GUI.einbettungsWaehler.value() + "' geladen.");
    GUI.berichtOben("Anzahl Zeilen in Textquelle:   " +  this.zeilen.length);
    GUI.berichtOben("Anzahl Wörter in Textquelle:   " +  this.nWoerter);
    GUI.berichtOben("Anzahl eingebetetteter Wörter: " +  this.nVokabeln);
    GUI.berichtOben("Dimensionen der Einbettung:    " +  this.nDimensionen);
    GUI.berichtOben();
    for (let zeile of this.kommentar) {
      GUI.berichtOben(zeile)
    }
    setTimeout(() => redraw(), 500);
  }

  // Schnittstelle: Liefert den Einbettungsvektor zu einem Wort.
  // Falls es das Wort nicht gibt, wird der Nullvektor geliefert.
  // Falls das Argument bereits ein Vektor ist, wird der Vektor geliefert.
  zuVektor(wortOderVektor) {
    let resultat;
    
    if (typeof(wortOderVektor) == "string") {
      resultat = this.wortZuVektorDict[wortOderVektor];
      if (resultat) {
        return resultat
      } else {
        return Array(this.nDimensionen).fill(0)
      }
    } else if (Array.isArray(wortOderVektor)) {
      resultat = wortOderVektor;
    }
    return resultat;
  }

  // Schnittstelle: Liefert die Kosinus-Ähnlichkeit zwischen zwei Wörtern
  // bzw. zwischen deren Vektoren.
  kosinusAehnlichkeit(wortOderVektorA, wortOderVektorB) {
    const vektorA = this.zuVektor(wortOderVektorA);
    const vektorB = this.zuVektor(wortOderVektorB);

    return kosinusAehnlichkeit(vektorA, vektorB);
  }

  // Schnittstelle: Liefert die n Wörter mit der höchsten 
  // Kosinus-Ähnlichkeit zu Wort A.
  // mode "dict": Als Array von Dicts im Format:
  // [{wort: "dünsten", aehnlichkeit: 0.9383}, {wort: "braten", ...} ...]
  // mode "array": Als Array von Wörtern: ["dünsten", "braten"]
  // mode "single": Das nächstgelegene Wort: "dünsten"
  // limit: mindeste Kosinus-Ählichkeit, die ein Nachbar haben muss.
  nachbarn(wortOderVektorA, mode="dict", n=5, limit=undefined) {
    let resultat = Object.keys(this.wortZuVektorDict).map(wortB => ({
      "wort": wortB,
      "aehnlichkeit": this.kosinusAehnlichkeit(wortOderVektorA, wortB)
    }));
    resultat.sort((wortL, wortR) => wortR.aehnlichkeit-wortL.aehnlichkeit);
    if (limit) {
      const tmp = [];
      for (let eintrag of resultat) {
        if (eintrag["aehnlichkeit"] > limit) {
           tmp.push(eintrag)
        }
      resultat = tmp;
      }
    }
    resultat = resultat.slice(0, n);
    if (mode == "dict") {
      return resultat;
    }
    if (mode == "array") {
      return resultat.map(element => element.wort);
    }
    if (mode == "single") {
      return resultat[0].wort;
    }
  }

  // Schnittstelle: Berechnet den Differenzvektor zwischen den
  // Einbettungsvektoren von wortA und wortB,
  // hängt diesen an den Einbettungsvektor von wortC an.
  // Das Ergebnis ist Vektor X.
  // Die Funktion liefert dann diejenigen Wörter zurück, dessen 
  // Einbettungsvektor dem Vektor X am ähnlichsten sind.
  // Argumente mode und n wie bei der Funktion nachbarn().
  relationsTransformation(wortA, wortB, wortC, mode="dict", n=5) {
    const vektorA = this.zuVektor(wortA);
    const vektorB = this.zuVektor(wortB);
    const vektorC = this.zuVektor(wortC);

    const relation = subtrahiereVektoren(vektorB, vektorA);
    const vektorD = addiereVektoren(vektorC, relation);

    return this.nachbarn(vektorD, mode, n);
  }

  // Schnittstelle: Erstellt einen Bericht über ein Wort als String.
  wortReport(wort) {
    let resultat = "";
    resultat += "WORT: " + wort + "\n";
    resultat += "ABSOLUTE HÄUFIGKEIT: " + this.metadaten[wort] + "\n";
    resultat += "RELATIVE HÄUFIGKEIT: " + this.wortZuHaeufigkeitDict[wort].toFixed(5) + "\n";
    const vektor = this.wortZuVektorDict[wort];

    let nachbarString = "";

    const nachbarn = this.nachbarn(wort, "dict", 11, 0.8);
    nachbarn.shift();

    for (let nachbar of nachbarn) {
      nachbarString += nachbar.wort.padEnd(18) + " : " +  nachbar.aehnlichkeit.toFixed(3) + "\n";
    }
    resultat += "NACHBARN:\n"
    resultat += nachbarString;

    return resultat;
  }

  // Schnittstelle: Mischt die Reihenfolge der Einträge in
  // wortZuVektorDict2D. Dient der grafischen Darstellung. Damit nicht
  // immer dieselben Worte vorne sind.
  mischeReihenfolge() {
    this.wortZuVektorDict2D = mischeObjekt(this.wortZuVektorDict2D);
  }

}