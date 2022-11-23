// Objekte dieser Klasse repräsentieren jeweils ein einzelnes Neuron.

class Neuron {

  constructor(nEingaenge) {
    this.nEingaenge = nEingaenge;
    this.gewichte = [];
    this.gewichteInitialisieren();
    this.zwischenspeicher = 0;
    this.delta = 0;
  }

  // Initialisiert die Gewichte mit zufälligen Zahlen zwischen 0 und 1
  gewichteInitialisieren() {
    for (let i = 0; i < this.nEingaenge; i++) {
      this.gewichte.push(random(-1, 1));
    }
  }

  // Berechnet die Ausgabe abhängig von der Eingabe.
  // Die Eingabe ist ein Array mit n Elementen.
  // Jedes Element wird mit dem entsprechenden Gewicht multipliziert,
  // die Summe all dieser Produkte wird durch die Aktivierungsfunktion
  // geschickt.
  ausgabe(eingabe) {
    let summe = 0;
    for (let idx in eingabe) {
      summe += eingabe[idx] * this.gewichte[idx];
    }
    this.zwischenspeicher = summe;
    return this.aktivierung(summe);
  }

  // Die Sigmoid-Aktivierungsfunktion 
  aktivierung(wert) {
    return 1 / (1 + exp(-wert));
  }

  // Die Ableitung der Aktivierungsfunktion
  aktivierungAbleitung(wert) {
    return this.aktivierung(wert) * (1-this.aktivierung(wert));
  }

}