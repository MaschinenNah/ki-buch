class QLerner {

  constructor(umwelt) {
    this.gamma = 0.9;
    this.epsilon = 0.1;
    this.alpha = 1;
    this.nAktionen = umwelt.nAktionen
    this.qTabelle = erzeugeMatrix(umwelt.nZustaende, this.nAktionen, 0);
    this.nSchritte = 0;
  }

  // Schnittstelle: wählt Aktion, führt sie aus, aktualisert die Q-Tabelle 
  // und liefert eine modifizierte Umwelt zurück
  schritt(umwelt) {
    const zustandsNr = umwelt.zustandsNr();
    const aktionsNr = this.waehleAktion(zustandsNr);
    const folgezustand = umwelt.aktion(aktionsNr);
    const folgezustandsNr = folgezustand.zustandsNr();
    const belohnung = folgezustand.belohnung();

    // Diese Abfrage ist im Buch weggelassen. Ohne dies würde der Q-Wert
    // des ersten Zustands einer neuen Episode von der mit dem letzten
    // Zustand der vorherigen Episode beeinflusst werden.
    if (! umwelt.neueEpisode) {
      this.aktualisiereQ(zustandsNr, aktionsNr, folgezustandsNr, belohnung);
      this.nSchritte += 1;
    }
    
    return folgezustand;
  }

  // Wählt Aktion abhängig von zustandsNr
  waehleAktion(zustandsNr) {
    
    const qTabellenZeile = this.qTabelle[zustandsNr];
  
    if (alleGleich(qTabellenZeile)) {
      return int(random(this.nAktionen));
    }

    if (random() < this.epsilon) {
      return int(random(this.nAktionen));
    }

    return maxPos(qTabellenZeile);
  }

  // Aktualiert die Q-Tabelle
  aktualisiereQ(zustandsNr, aktionsNr, folgezustandsNr, belohnung) {
    const qTabellenZeileFolgezustand = this.qTabelle[folgezustandsNr];
    const maxQ = max(qTabellenZeileFolgezustand);
    const qNeu = belohnung + this.gamma * maxQ;
    this.qTabelle[zustandsNr][aktionsNr] = qNeu;
  }

  // Aktualisiert die Q-Tabelle mit Alpha
  // (wird im aktuellen Projekt nicht genutzt, kann aber bei
  // Umwelten mit zufallsgesteuertem Verhalten nützlich sein)
  aktualisiereQAlpha(zustandsNr, aktionsNr, folgezustandsNr, belohnung) {
    const qAlt = this.qTabelle[zustandsNr][aktionsNr];
    const qTabellenZeileFolgezustand = this.qTabelle[folgezustandsNr];
    const maxQ = max(qTabellenZeileFolgezustand);
    const qNeu = qAlt + this.alpha (belohnung + this.gamma * maxQ - qAlt);
    this.qTabelle[zustandsNr][aktionsNr] = qNeu;
  }
  
  // Für die GUI: Der Q-Wert eines Zustandes
  qWert(zeile, spalte) {
    const zustandsNr = umwelt.koordinateNachZustandsNr(zeile, spalte);
    return max(this.qTabelle[zustandsNr]);
  }
  
  // Für die GUI: Die vielversprechendste Aktion zu einem Zustand
  aktionOhneEpsilon(zustandsNr) {
    const qTabellenZeile = this.qTabelle[zustandsNr];
    return maxPos(qTabellenZeile);
  }
 
}