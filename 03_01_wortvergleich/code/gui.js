const GUI = {

  eingabeA: undefined,
  eingabeB: undefined,
  distanzAusgabe: undefined,
  matrixMonitor: undefined,

  erzeugeGUI() {
    noCanvas();

    createElement("h1", "Wortvergleich");
    
    // Eingabe String A (senkrecht)
    createElement("label", "String A.....");
    this.eingabeA = createInput();
    this.eingabeA.input(eingabe);
     
    // Eingabe String B (waagerecht)
    createElement("label", "String B.....");
    this.eingabeB = createInput();
    this.eingabeB.input(eingabe);

    // Ausgabe Editierdistanz
    createElement("label", "Editierdistanz");
    this.distanzAusgabe = createInput();
    this.distanzAusgabe.attribute('disabled', '');

    // Ausgabe Levensthein Matrix
    createElement("label", "Levenshtein-Matrix");
    this.matrixMonitor = createElement('textarea');
    this.matrixMonitor.attribute('disabled', '');
    this.matrixMonitor.style('resize', 'none');
  }

}