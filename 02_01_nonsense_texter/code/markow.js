// Da diese Klasse in Kapitel 2 ausführlich diskutiert wird, stehen
// hier nur spärliche Kommentare.

class Markow {

  constructor() {
    this.uebergaenge = {};
  }

  // Schnittstelle: Alle Übergänge in einem Text lernen
  lerneText(textQuelle, grad) {
    this.uebergaenge = {};
    const nUebergaenge = textQuelle.length - grad;

    for (let i = 0; i < nUebergaenge; i++) {
      const letzteZeichen = textQuelle.slice(i, i + grad);
      const naechstesZeichen = textQuelle[i + grad];
      this.lerneUebergang(letzteZeichen, naechstesZeichen);
    }
  }
  
  lerneUebergang(letzteZeichen, naechstesZeichen) {
    const eintrag = this.uebergaenge[letzteZeichen];
    if (!eintrag) {
      this.uebergaenge[letzteZeichen] = [naechstesZeichen];
    } else {
      if (!eintrag.includes(naechstesZeichen)) {
        eintrag.push(naechstesZeichen);
      }
    }
  }
  
  // Schnittstelle: Text erzeugen
  erzeugeText(anfang, nZeichen) {
    let letzteZeichen = anfang;
    const sequenz = [anfang];

    while (sequenz.length <= nZeichen) {
      const naechsteZeichen = this.zufaelligerUebergang(letzteZeichen);
      if (!naechsteZeichen) {
        break;
      }
      sequenz.push(naechsteZeichen);
      letzteZeichen = (letzteZeichen + naechsteZeichen).slice(1);
    }

    let ergebnis = sequenz.join("");
    ergebnis = ergebnis.replaceAll("B", "&#13");
    return ergebnis + "...";
  }

  zufaelligerUebergang(letzteZeichen) {
    const eintrag = this.uebergaenge[letzteZeichen];
    if (eintrag) {
      return random(eintrag);
    }
  }

  // Schnittstelle: Übergänge als String für die Darstellung im GUI
  uebergaengeAlsString() {
    const zeilen = [];
    const anschluesseAlsTabelle = Object.entries(this.uebergaenge);
    for (let [dieseZeichen, naechstesZeichen] of anschluesseAlsTabelle) {
      dieseZeichen = dieseZeichen.replaceAll(" ", "_");
      naechstesZeichen = naechstesZeichen.join("|");
      naechstesZeichen = naechstesZeichen.replaceAll(" ", "_");
      const zeile = dieseZeichen + " -> " + naechstesZeichen;
      zeilen.push(zeile);
    }
    const ergebnis = zeilen.join('&#13;');
    return ergebnis;
  }

}