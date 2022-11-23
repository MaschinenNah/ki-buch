// Objekte dieser Klasse repräsentieren eine Schicht eines neuronalen 
// Netzes.

class Schicht {
  
  constructor(nNeuronen, vorherigeSchicht) {
    this.nNeuronen = nNeuronen + 1;
    this.vorherigeSchicht = vorherigeSchicht;
    this.neuronen = [];
    this.zwischenspeicher = undefined;
    
    let nEingaenge;

    if (this.vorherigeSchicht) {
      nEingaenge = vorherigeSchicht.nNeuronen;
    } else {
      nEingaenge = 0;
    }

    for (let i = 0; i < this.nNeuronen-1; i++) {
      const neuron = new Neuron(nEingaenge);
      this.neuronen.push(neuron);
    }
    
    const biasNeuron = new BiasNeuron();
    this.neuronen.push(biasNeuron);

    this.nGewichte = nEingaenge * (this.nNeuronen - 1);
  }

  // Berechnet die Ausgabe dieser Schicht abhängig von der Eingabe
  ausgabe(eingabe) {
    // Wenn diese Schicht eine Eingabeschicht ist 
    // (also keine vorherige Schicht existiert),
    // wird die Eingabe direkt in den Zwischenspeicher geschrieben
    if (this.vorherigeSchicht == undefined) {
      this.zwischenspeicher = [...eingabe, 1];
      return [...eingabe, 1];
    }

    // Andernfalls wird für jedes Neuron dieser Schicht die Ausgabe 
    // berechnet und in den Zwischenspeicher geschrieben
    const resultat = [];
    for (let neuron of this.neuronen) {
      resultat.push(neuron.ausgabe(eingabe));
    }
    this.zwischenspeicher = resultat;
    return resultat;
  }

  // Diese Funktion wird nur dann aufgerufen, wenn die Schicht eine
  // Ausgabeschicht ist: Sie berechnet das Delta, also die Differenz
  // zwischen der gewünschten und der tatsächlichen Ausgabe. 
  berechneDeltaAusgabeschicht(ausgabeSoll) {
    // Das Bias-Neuron soll nicht in die Berechnung von Delta einfließen
    const limit = this.nNeuronen-1;
    for (let idxNeuron = 0; idxNeuron < limit; idxNeuron++) {
      const neuron = this.neuronen[idxNeuron];
      const neuronVorAktivierung = neuron.zwischenspeicher;
      const differenz = ausgabeSoll[idxNeuron] - this.zwischenspeicher[idxNeuron];
      neuron.delta = neuron.aktivierungAbleitung(neuronVorAktivierung) * differenz;
    }
  }

  // Berechnet das Delta für verdeckte Schichten
  berechneDeltaAndereSchichten(folgendeSchicht) {
    // Das Bias-Neuron soll nicht in die Berechnung von Delta einfließen:
    const limit = this.nNeuronen-1;
    for (let idxNeuron = 0; idxNeuron < limit; idxNeuron++) {
      let neuron = this.neuronen[idxNeuron];
      let gewichte = [];
      let deltas = [];
      const limit = folgendeSchicht.nNeuronen-1;
      for (let idxNeuronFolgeschicht = 0; idxNeuronFolgeschicht < limit; idxNeuronFolgeschicht++) {
        const neuronFolgeschicht = folgendeSchicht.neuronen[idxNeuronFolgeschicht];
        const gewicht = neuronFolgeschicht.gewichte[idxNeuron];
        gewichte.push(gewicht);
        deltas.push(neuronFolgeschicht.delta);
      }
      let gewichteMalDelta = 0;
      for (let idxGewichte in gewichte) {
        gewichteMalDelta += gewichte[idxGewichte] * deltas[idxGewichte];
      }
      neuron.delta = neuron.aktivierungAbleitung(neuron.zwischenspeicher) * gewichteMalDelta;
    }
  }

}