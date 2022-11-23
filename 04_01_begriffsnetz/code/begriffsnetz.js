class Begriffsnetz {

  constructor(transaktionsStrings) {
    this.itemStrings = this.berechneItemStrings(transaktionsStrings);
    this.itemStringToId = invertiereArray(this.itemStrings);
    this.transaktionen = this.enkodiereTransaktionen(transaktionsStrings);
    this.supportEinzel = this.berechneSupportEinzel();
    this.supportAB = this.berechneSupportAB();
    this.confidenceAB = this.berechneMatrixAB("confidence");
    this.liftAB = this.berechneMatrixAB("lift");
  }
  
  // Schnittstelle:
  // Liefert für ein gegebene ItemA die naheliegendsten n Assoziationen.
  // Das Argument kenngroesse ist "supportAB", "confidenceAB" oder "liftAB".
  // Ausgabeformat ist ein Array mit Objekten, von denen jedes eine
  // Assoziation mit einem ItemB mit den Eigenschaften itemB, itemBString
  // und Gewicht repräsentiert.
  assoziationen(itemIdA, kenngroesse, n) {
    // Zu itemA genörende Zeile in der Matrix auswählen
    const matrixZeile = this[kenngroesse][itemIdA];
    // Ein Array mit den Assoziations-Objekten befüllen
    let resultat = matrixZeile.map((gewicht, itemIdB) => 
      ({itemIdB: itemIdB,
        itemStringB: this.itemStrings[itemIdB],
        gewicht: gewicht})
    );
    // Nur notwendig bei kleinen Datensätzen, verhindert Assoziation mit
    // sich selbst. Im Buch weggelassen.
    resultat = resultat.filter(assoziation => itemIdA != assoziation.itemIdB);
    // Nach Gewicht sortieren
    resultat.sort((itemL, itemR) => itemR.gewicht-itemL.gewicht);
    // Erste n auswählen
    resultat = resultat.slice(0, n);
    return resultat;
  }
  
  // Liefert ein Array, in dem jeder itemString einmal vorkommt.
  // Die Indizes jedes itemStrings ensprechen dessen Id.
  berechneItemStrings(transaktionsStrings) {
    const einString = transaktionsStrings.join(" ");
    const itemStrings = einString.split(" ");
    return [...new Set(itemStrings)];
  }

  // Übersetzt alle transaktionsStrings in Arrays mit den entsprechenden
  // itemIds und liefert ein zweidimensionales Array ([[27, 9, 102], ...]])
  enkodiereTransaktionen(transaktionsStrings) {
    return transaktionsStrings.map(this.enkodiereTransaktion, this);
  }

  // Übersetzt einen transaktionsString ("dies das jenes") in ein Array mit
  // den entsprechenden itemIds ([27, 9, 102])
  enkodiereTransaktion(transaktionsString) {
    const itemStrings = transaktionsString.split(" ");
    return itemStrings.map(itemString => this.itemStringToId[itemString]);
  }

  // supportEinzel ist ein Array, das für jedes einzelne Item den 
  // Support speichert
  berechneSupportEinzel(){
    const nItems = this.itemStrings.length;
    const nTransaktionen = this.transaktionen.length;
    let resultat = new Array(nItems).fill(0);

    for (let transaktion of this.transaktionen) {
      for (let itemId of transaktion) {
        resultat[itemId] += 1;
      }
    }

    resultat = resultat.map(n => n/nTransaktionen);

    return resultat;
  }

  // supportAB ist ein 2D Array, das für jedes Itempaar A und B den 
  // Support speichert
  berechneSupportAB() {
    const nItems = this.itemStrings.length;
    const nTransaktionen = this.transaktionen.length;
    let resultat = erzeugeMatrix(nItems, nItems, 0);

    // Für jedes Item
    for (let itemIdA = 0; itemIdA < nItems; itemIdA++) {
      // Für jede Transaktion...
      for (let transaktion of this.transaktionen) {
        // Wenn die Transaktion itemA enthält...
        if (transaktion.includes(itemIdA)) {
          // Für jedes Item in dieser Transaktion...
          for (let itemIdB of transaktion) {
            // Wenn die beiden Items identisch sind, abbrechen!
            if (itemIdA == itemIdB) {
              break;
            }
            // Die Zähler für das gemeinsame Vorkommen je um 1 erhöhen
            resultat[itemIdA][itemIdB] += 1;
            resultat[itemIdB][itemIdA] += 1;
          }
        }
      }
    }
    
    // Die Werte aller Zellen durch die Anzahl der Transaktionen teilen
    resultat = resultat.map(zeile => 
      zeile.map(zelle => zelle / nTransaktionen)
    );

    return resultat;
  }

  // Dient zur Füllung der Matrizen confidenceAB und supportAB
  berechneMatrixAB(kenngroesse) {
    const nItems = this.itemStrings.length
    const resultat = erzeugeMatrix(nItems, nItems, 0);

    for (let itemIdA = 0; itemIdA < nItems; itemIdA++) {
      for (let itemIdB = 0; itemIdB < nItems; itemIdB++) {
        // this.confidence() oder this.lift() aufrufen
        resultat[itemIdA][itemIdB] = this[kenngroesse](itemIdA, itemIdB);
      }
    }

    return resultat;
  }
  

  // Berechnet Confidence für das Itempaar A -> B 
  confidence(itemIdA, itemIdB) {
    const supportA = this.supportEinzel[itemIdA];

    if (supportA == 0) {
      return 0;
    }

    const supportAB = this.supportAB[itemIdA][itemIdB];

    return supportAB / supportA;
  }
  
  // Berechnet Lift für das Itempaar A und B 
  lift(itemIdA, itemIdB) {
    const supportA = this.supportEinzel[itemIdA];
    const supportB = this.supportEinzel[itemIdB];

    if (supportA == 0 || supportB == 0) {
      return 0;
    }

    const supportAB = this.supportAB[itemIdA][itemIdB];

    return supportAB / (supportA * supportB);
  }

}
