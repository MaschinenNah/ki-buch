// Die Hilfsklasse Spielzuege dient dazu, alle auf einem Spielzustand
// zulässigen Züge zu speichern
class Spielzuege extends Array{

  constructor(...args) {
    super(...args);
    this.geschlageneSteine = [];
  }
  
  // Hinzufügen eines Zuges
  hinzufuegen(zugKoord, geschlageneSteine){
    this.push(zugKoord);
    this.geschlageneSteine.push(geschlageneSteine);
  }
  
  // Abfragen eines Zuges, Rückgabewert sind die Koordinaten der Steine,
  // die umgedreht werden oder undefined, wenn der Zug nicht gültig ist
  ergebnis(zugKoord) {
    for (let idx=0; idx<this.length; idx++) {
      const spielzug = this[idx];
      if (zugKoord[0] == spielzug[0] && zugKoord[1] == spielzug[1]) {
        return this.geschlageneSteine[idx];
      }
    }
  }

}

// Objekte der Klasse Spielzustand repräsentieren ein Reversi Spielbrett
// und die Spielmechanik: Jeder Spielzustand weiß, welche Züge auf ihm
// zulässig sind und welche Folgen der jeweilige Zug hat. Ein Zug verändert
// nicht den Spielzustand, sondern liefert einen modifizierten Spielzustand
// zurück.
class Spielzustand {

  static richtungen = [[-1, -1],
                       [-1, 0],
                       [-1, 1],
                       [0, -1],
                       [0,  1],
                       [1, -1],
                       [1,  0],
                       [1,  1]];
    
  constructor(spielzustand) {
    this.groesse = 8;
    this.zellen = undefined;
    this.moeglicheZuege = undefined;
    this.letzterZug = undefined;
    this.spieler = undefined;
    this.steineMalGewichte = undefined;
    this.passZaehler = undefined;
    this.nZuegeMax = undefined;
    
    // Ein im Konstruktorargument übergebener Spielzustand wird kopiert.
    // Andernfalls repräsentiert der erzeugte Spielzustand ein neues Spiel. 
    if (!spielzustand) {
      this.initialisiereNeu();
    } else {
      this.initialisiereKopie(spielzustand);
    }

  }

  // Spielzustand initialisieren, der ein neues Spiel repäsentiert:
  initialisiereNeu() {
    this.zellen = erzeugeMatrix(this.groesse, this.groesse, 0);
    
    const mitte01 = this.groesse/2 -1;
    const mitte02 = this.groesse/2;
    
    this.zellen[mitte01][mitte01] = -1;
    this.zellen[mitte02][mitte02] = -1;
    this.zellen[mitte01][mitte02] = 1;
    this.zellen[mitte02][mitte01] = 1;
    
    this.spieler = -1;
    this.passZaehler = 0;
    this.nZuegeMax = 8 * 8 - 4;
    this.aktualisiereSpielzuege();
    this.aktualisiereBewertung();
  }

  // Spielzustand initialisieren, der eine Kopie eines vorhandenen
  // Spielzustandes ist. Spielzustände werden in dieser Anwendung nur _vor
  // einem Zug kopiert. Daher werden moeglicheZuege und steineMalGewichte
  // _nicht_ mitkopiert, da diese Eigenschaften sich mit einem Zug
  // ohnehin ändern.
  initialisiereKopie(spielzustand) {
    this.zellen = [];
    for (let i = 0; i < this.groesse; i++) {
      this.zellen[i] = [...spielzustand.zellen[i]];
    }

    this.letzterZug = spielzustand.letzterZug;
    this.spieler = spielzustand.spieler;
    this.passZaehler = spielzustand.passZaehler;
  }

  // Schnittstelle: Gibt es zumindest einen gültigen Zug?
  zugIstMoeglich() {
    return this.moeglicheZuege.length > 0;
  }

  // Schnittstelle: Ist das Spiel zuende?
  // Das Spiel ist zuende, wenn zweimal hintereinander gepasst wurde.
  // Es ist nicht notwendig, zu prüfen, ob es noch freie Felder gibt,
  // weil es auch auf zweimal hintereinander passen hinausläuft, wenn
  // dies der Fall ist.
  spielIstZuende() {
    return this.passZaehler > 1;
  }

  // Schnittstelle: Führt Zug aus.
  // Ein Zug verändert den Spielzustand nicht, sondern liefert einen
  // modifizierten Spielzustand, sofern der Zug gültig ist, ansonsten 
  // undefined.
  zug(zugKoord) {

    const geschlageneSteine = this.moeglicheZuege.ergebnis(zugKoord);

    // Nur wenn der Zug gültig ist...
    if (geschlageneSteine) {
      // Spielzustand kopieren...
      let resultat = new Spielzustand(this);
      resultat.zellen[zugKoord[0]][zugKoord[1]] = resultat.spieler;
      // Geschlagene Steine umdrehen...
      for (let geschlagen of geschlageneSteine) {
        resultat.zellen[geschlagen[0]][geschlagen[1]] *= -1
      }
      resultat.letzterZug = zugKoord;
      // Spieler wechseln und Spielzustand aktualisieren
      resultat.spieler *= -1;
      resultat.aktualisiereSpielzuege();
      resultat.aktualisiereBewertung();
      return resultat;
    }

  }

  // Die Bewertung (steineMalGewichte) wird immer dann aktualisert, wenn
  // ein neuer Spielzustand erzeugt wurde oder auf einem kopierten
  // Spielzustand ein Zug ausgeführt wurde. Die Werte der Steine (-1 für 
  // schwarz und 1 für weiß) werden mit einem Gewicht multipliziert, das
  // abhängig von der Position des Gewichtes ist: Ränder haben das 
  // Gewicht 3, Ecken das Gewicht 5, alle anderen Felder das Gewicht 1.
  aktualisiereBewertung() {
    let steineMalGewichte = 0;

    for (let zeile = 0; zeile < this.groesse; zeile++) {
      for (let spalte = 0; spalte < this.groesse; spalte++) {
        // jede Zelle
        let zellenGewicht = 1;
        // oberer oder unterer Rand
        if (zeile == 0 || zeile == this.groesse-1) {
          zellenGewicht += 2;
        }
        // linker oder rechter Rand
        if (spalte == 0 || spalte == this.groesse-1) {
          zellenGewicht += 2;
        }
        steineMalGewichte += zellenGewicht * this.farbe([zeile, spalte]);
      }
    }
    this.steineMalGewichte = steineMalGewichte;
  }

  // Schnittstelle: Liefert die Bewertung.
  // Diese Funktion wird vom MiniMax Algorithmus aufgerufen.
  // Bei fertig gespielten Partien zeigt -Number.MAX_VALUE; einen Gewinn von 
  // Schwarz an, Number.MAX_VALUE; einen Gewinn von Weiß, 0 steht für 
  // unentschieden. Wenn es noch Zugmöglichkeiten gibt, ist 
  // steineMalGewichte die Bewertung.
  bewertung() {
    if (this.spielIstZuende()) {
      if(this.gewinner() == -1){
        return -Number.MAX_VALUE;
      } else if (this.gewinner() == 1) {
        return Number.MAX_VALUE;
      } else {
        return 0;
      }
    }
    return this.steineMalGewichte;
  }

  // Schnittstelle: liefert die Farbe einer Zelle
  farbe(zelle) {
    const zeile = zelle[0];
    const spalte = zelle[1];
    return this.zellen[zeile][spalte];
  }

  // Die zulässigen Züge werden immer dann - und nur dann - aktualisiert,
  // nachdem ein Zug gemacht bzw. gepasst wurde.
  aktualisiereSpielzuege() {

    this.moeglicheZuege = new Spielzuege();

    // Wenn zweimal hintereinander gepasst wurde, kann es keine
    // gültigen Züge geben
    if (this.passZaehler >= 2) {
      this.spieler = 0;
      return;
    }
    
    // Alle Koordinaten werden systematisch probiert
    for (let zeile = 0; zeile < this.groesse; zeile++) {
      for (let spalte = 0; spalte < this.groesse; spalte++) {
        const zugKoord = [zeile, spalte];
        const geschlageneSteine = this.zugErgebnis(zugKoord);
      
        // Wenn dieser Zug Steine schlägt, ist es ein gültiger Zug...
        if (geschlageneSteine) {
          // ... und wird den möglichen Zügen hinzugefügt
          this.moeglicheZuege.hinzufuegen(zugKoord, geschlageneSteine);
        }
      }
    }

    // Wenn kein gültiger Zug gefunden wurde, passZaehler um 1 erhöhen
    // und Spieler wechseln. Sonst passZaehler auf 0 setzen:
    if (!this.zugIstMoeglich()){
      this.passZaehler += 1;
      this.spieler *= -1;
      this.aktualisiereSpielzuege();
    } else {
      this.passZaehler = 0;
    }
  }

  // Diese Funkton ermittelt, ob ein Zug gültig ist und liefert in diesem
  // Fall die Koordinaten der Steine, die dabei geschlagen würden, sonst
  // undefined:
  zugErgebnis(zugKoord) {
    
    // Zelle ist besetzt, daher kein gültiger Zug:
    if (this.farbe(zugKoord) != 0) {
      return;
    }

    let geschlagene = [];

    // Startpositionen für Suche
    let zeileStart = zugKoord[0];
    let spalteStart = zugKoord[1];

    // Für jede Richtung...
    for (let richtung of Spielzustand.richtungen) {
      let zeile = zeileStart;
      let spalte = spalteStart;
      let kandidaten = [];

      while (true) {
        // Gehe einen Schritt in die aktuelle Richtung...
        zeile += richtung[0];
        spalte += richtung[1];
        // Wenn der Spielfeldrand nicht überschritten wurde...
        if (zeile >= 0 && zeile < this.groesse && 
            spalte >= 0 && spalte < this.groesse) {
          // Untersuche aktuelle Zelle
          const zelle = [zeile, spalte];
          const farbe = this.farbe(zelle);
          // Wenn die Zelle belegt ist...
          if (farbe != 0) {
            // und die Zelle mit einem gegnerischen Stein belegt ist
            if (farbe == this.spieler*-1) {
              // Füge die Zelle den kandidaten hinzu
              kandidaten.push(zelle)
              // Wenn die Zelle mit einem eigenen Stein belegt ist
              // und es Kandidaten gibt...
            } else if (kandidaten.length > 0) {
              for (let kandidat of kandidaten) {
                geschlagene.push(kandidat);
              }
              // Richtung abbrechen, weil gültiger Zug abgeschlossen wurde
              break;
            } else {
              // Richtung abbrechen, weil Zelle mit eigenem Stein belegt
              // und kein gegnerischer Stein übersprungen wurde
              break;
            }
          } else {
            // Richtung abbrechen, weil Zelle nicht belegt
            break;
          }
        } else {
          // Richtung abbrechen, weil Spielfeldrand überquert
          break;
        }
      } 
    }

    if (geschlagene.length > 0) {
      return geschlagene;
    }

  }

  // Schnittstelte: Zählt die Steine und liefert den Gewinner:
  // -1 | 0 | 1 : Schwarz | unentschieden | Weiß
  gewinner() {
    let zaehler = 0;
    for (let zeile = 0; zeile < this.groesse; zeile++) {
      for (let spalte = 0; spalte < this.groesse; spalte++) {
        zaehler += this.zellen[zeile][spalte]
      }
    }
  
    if (zaehler < 0) {
      return -1;
    } else if (zaehler > 0) {
      return 1;
    } else {
      return 0;
    }
  }

  // Schnittstelle: Liefert das Punkteverhältnis im Format
  // {zaehlerSchwarz: _, zaehlerWeiß: _}
  punkteVerhaeltnis() {
    let zaehlerSchwarz = 0;
    let zaehlerWeiss = 0;

    for (let zeile = 0; zeile < this.groesse; zeile++) {
      for (let spalte = 0; spalte < this.groesse; spalte++) {
        const val = this.zellen[zeile][spalte];
        if (val == -1) {
          zaehlerSchwarz += 1;
        } else if (val == 1) {
          zaehlerWeiss += 1;
        }
      }
    }
  
    return {schwarz: zaehlerSchwarz, weiss: zaehlerWeiss};
  }

} 
