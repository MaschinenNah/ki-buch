const GUI = {
  
  textWaehler: undefined,
  gradWaehler: undefined,
  gradAnzeige: undefined,
  lerneTextButton: undefined,
  erzeugeTextButton: undefined,
  textAusgabe: undefined,

  erzeugeGUI() {
    noCanvas();
    
    createElement("h1", "Nonsense-Texter");
    
    // Textausgabe
    this.textAusgabe = createElement('textarea');
    this.textAusgabe.attribute('disabled', '');
    const umbruch = createElement("br");

    // Legende
    const legendenText = "_ = Leerzeichen,  B = Zeilenumbruch,  | = Trennzeichen";
    const legende = createElement("label", legendenText);
    legende.id("legende");

    // Drop-down Textquelle
    createElement("label", "Quelle............");
    this.textWaehler = createSelect();
    this.textWaehler.option("goethe.txt");
    this.textWaehler.option("kafka.txt");
    this.textWaehler.option("austen.txt");
    this.textWaehler.option("proust.txt");
    this.textWaehler.option("cervantes.txt");
    this.textWaehler.option("kapitel02.txt");
    this.textWaehler.option("test.txt");
    this.textWaehler.changed(textGewaehlt);

    // Drop-down Grad
    createElement("label", "Grad..............");
    this.gradWaehler = createSelect();
    this.gradWaehler.option(0);
    this.gradWaehler.option(1);
    this.gradWaehler.option(2);
    this.gradWaehler.option(3);
    this.gradWaehler.option(4);
    this.gradWaehler.option(5);
    this.gradWaehler.option(6);
    this.gradWaehler.value(4);
    this.gradWaehler.changed(gradGewaehlt);

    // Button Text lernen
    this.lerneTextButton = createButton("Text lernen");
    this.lerneTextButton.attribute('disabled', '');
    this.lerneTextButton.mousePressed(lerneText);

    // Button Text erzeugen
    this.erzeugeTextButton = createButton("Text erzeugen");
    this.lerneTextButton.attribute('disabled', '');
    this.erzeugeTextButton.mousePressed(erzeugeText);
  }

}