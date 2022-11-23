class KI {

  // Schnittstelle: Besten Zug ermitteln
  besterZug(spielzustand, suchtiefe){
    // Wenn kein Zug möglich, herausspringen
    if(!spielzustand.zugIstMoeglich()) {
      return
    }
    // Zugarchiv des untersuchten Spielzustandes löschen
    spielzustand.zugArchiv = [];
    // Alle möglichen Spielverläufe berechnen,
    // ausgehend vom untersuchten Spielzustand mit gegebener Suchtiefe
    const zustaende = this.berechneSpielverlaeufe(spielzustand, suchtiefe);
    // Die Spielverläufe nach Bewertung sortieren
    this.sortiereNachBewertung(zustaende);
    // Der erste Zustand repräsentiert den besten Zug
    const besterZustand = zustaende[0];
    // Der erste Zug des besten Zustands ist der Beste Zug
    const besterZug = besterZustand.zugArchiv[0];
    return besterZug;
  }

  sortiereNachBewertung(spielzustaende) {
    spielzustaende.sort((spielzustandL, spielzustandR) => 
      spielzustandR.bewertung() - spielzustandL.bewertung());
  }

  // Alle Spielverläufe von einem gegebenen Spielzustand und gegebener Suchtiefe berechnen
  berechneSpielverlaeufe(spielzustand, suchtiefe) {
    let warteschlange = [spielzustand];
    let resultat = [];
    
    while (warteschlange.length != 0) {
      const spielzustand = warteschlange.shift();

      // Wenn im untersuchten Spielzustand keine Züge mehr möglich...
      if (!spielzustand.zugIstMoeglich()) {
        // ...Spielzustand den fertigen hinzufügen...
        resultat.push(spielzustand);
        // ...und Schleifendurchgang beenden
        continue;
      }

      // Wenn die Suchtiefe erreicht wurde...
      if (spielzustand.zugArchiv.length == suchtiefe) {
        // ...Spielzustand den fertigen hinzufügen...
        resultat.push(spielzustand);
        // ...und Schleifendurchgang beenden
        continue;
      }
 
      // Wenn der Spielzustand Zugoptionen hat und die Suchtiefe nicht 
      // erreicht ist...
      // ...alle Folgezustände berechnen...
      let folgezustaende = this.berechneFolgezustaende(spielzustand);
      // ...nach Bewertung sortieren...
      this.sortiereNachBewertung(folgezustaende);
      // ...und die 3 besten Folgezustände der Warteschlange anhängen
      folgezustaende = folgezustaende.slice(0, 3);
      warteschlange = warteschlange.concat(folgezustaende);
    }

    return resultat;
  }

  // Alle Folgezustände eines Spielzustandes berechnen
  berechneFolgezustaende(spielzustand){
    const moeglicheZuege = spielzustand.moeglicheZuege;
    return moeglicheZuege.map(einZug => spielzustand.zug(einZug));
  }

}