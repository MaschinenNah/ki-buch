const GUI = {

  textEingabe: undefined,
  wortEinfuegeKnoepfe: [],

  erzeugeGUI() {
    createElement("h1", "Wörter vorschlagen");

    noCanvas();

    this.textEingabe = createElement("textarea");
    this.textEingabe.input(eingabe);
  }

}