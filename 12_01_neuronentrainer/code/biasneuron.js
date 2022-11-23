// Das Bias-Neuron führt eine recht kümmerliche Existenz. Es hat 
// einzig und allein die Aufgabe, den Wert 1 auszugeben, egal was
// sonst so anliegt. Nichtsdestotrotz ist es unverzichtbar:
// Der in Kapitel 10 vorgestellte Bias-Wert wird durch ein Gewicht
// repräsentiert, an das immer das Signal 1 anliegt.

class BiasNeuron {

  ausgabe() {
    return 1;
  }

}