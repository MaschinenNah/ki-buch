// Objekte dieser Klasse repräsentieren ein vollständiges neuronales
// Netz, das aus aufeinander folgenden Schichten aufgebaut ist.

class Netz {

  // Das Argument struktur ist ein Array, das ganze Zahlen enthält.
  // Jede Zahl steht für eine Schicht und die Anzahl der darin enthaltenen
  // Neuronen.
  // [10, 10] --> Eingabeschicht und Ausgabeschicht mit je 10 Neuronen
  // [3, 10, 3] --> Eingabesch. 3, verdeckte Sch. 10, Ausgabesch. 3 Neuronen
  // etc...
  constructor(struktur, lernrate) {

    this.struktur = struktur;
    this.lernrate = lernrate;
    this.schichten = [];

    // Die Eingabeschicht hat keine vorherige Schicht...
    const eingabeSchicht = new Schicht(this.struktur[0]);
    this.schichten.push(eingabeSchicht);

    // Die weiteren Schichten werden jeweils mit der vorherigen Schicht
    // verknüpft...
    for (let idx = 1; idx < struktur.length; idx++) {
      const vorherigeSchicht = this.schichten[idx-1];
      const schicht = new Schicht(this.struktur[idx], vorherigeSchicht);
      this.schichten.push(schicht);
    }

    // Diese vier Werte benötigen wir für die Darstellung des
    // Trainingsverlaufes im GUI
    this.fehlerHistory = [];
    this.letzterFehler = 0;
    this.nTrainierteBeispiele = 0;
    this.nGewichte = 0;
    for (let schicht of this.schichten) {
      this.nGewichte += schicht.nGewichte;
    }
  }

  // Berechnung der Ausgabe des Netzes abhängig von der Eingabe
  ausgabe(eingabe) {
    this.schichten[0].ausgabe(eingabe);

    for (let idx = 1; idx < this.struktur.length; idx++) {
      const eingabe = this.schichten[idx-1].zwischenspeicher;
      this.schichten[idx].ausgabe(eingabe);
    }
    
    // Weil auch die Ausgabeschicht ein Bias-Neuron hat, muss es entfernt
    // werden....
    const ausgangsschicht = this.schichten[this.struktur.length-1];
    const zwischenspeicher = ausgangsschicht.zwischenspeicher;
    const nAusgangsneuronen = ausgangsschicht.nNeuronen-1
    return zwischenspeicher.slice(0, nAusgangsneuronen);
  }

  // Schnittstelle: Das Training des Netzes anhand von Trainingsbeispielen
  trainiereBeispiele(beispiele) {
    for (let beispiel of beispiele) {
      this.ausgabe(beispiel.eingabe);
      this.berechneAlleDeltas(beispiel.ausgabe);
      this.gewichteAnpassen();
    }
    this.nTrainierteBeispiele += beispiele.length;
  }

  // Die Berechnung aller Deltas von hinten nach vorne
  berechneAlleDeltas(ausgabeSoll) {
    this.schichten[this.struktur.length-1].berechneDeltaAusgabeschicht(ausgabeSoll);
    // Für die Eingangsschicht müssen keine Deltas berechnet werden.
    for (let idx = this.struktur.length-2; idx >= 1; idx--) {
      this.schichten[idx].berechneDeltaAndereSchichten(this.schichten[idx+1]);
    }
  }

  // Anpassung aller Gewichte abhängig von Delta
  gewichteAnpassen() {
    for (let idxSchicht = 1; idxSchicht < this.struktur.length; idxSchicht++) {
      const schicht = this.schichten[idxSchicht];
      for (let neuron of schicht.neuronen) {
        for (let idxGewicht in neuron.gewichte) {
          neuron.gewichte[idxGewicht] +=  this.lernrate *
                                          schicht.vorherigeSchicht.zwischenspeicher[idxGewicht] * 
                                          neuron.delta;
        }
      }
    }
  }

  // Schnittstelle: Liefert die Fehlerquote (Anzahl Beispiele / richtige)
  ermittleFehler(beispiele) {
    let fehler = 0;
    for (let beispiel of beispiele) {
      const vermutung = this.ausgabe(beispiel.eingabe);
      const wahrheit = beispiel.ausgabe;
      const klasseVermutet = maxPos(vermutung);
      const klasseWahr = maxPos(wahrheit);
      if (klasseWahr != klasseVermutet) {
        fehler += 1;
      }
    }
    const resultat = fehler / beispiele.length;
    this.fehlerHistory.push(resultat);
    this.letzterFehler = resultat;
    return resultat;
  }

}