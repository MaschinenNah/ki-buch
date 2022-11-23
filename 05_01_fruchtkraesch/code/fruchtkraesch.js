// Hilfsklasse: Behälter für alle in einem Spielzustand möglichen Spielzüge.
// Ein einzelner Spielzug ist ein Array mit den Koordinaten einer
// zusammenhängenden Gruppe von mindestens 3 gleichfarbigen Steinen.
// Solche Gruppen nennen wir "gleichfarbigeGruppen".

class Spielzuege extends Array {

  constructor(...args) {
    super(...args);
    this.gleichfarbigeGruppen = [];
  }

  push(gleichfarbigeGruppe){
    const spielzug = gleichfarbigeGruppe[0];
    super.push(spielzug);
    this.gleichfarbigeGruppen.push(gleichfarbigeGruppe);
  }
   
  suche(zugKoordinaten) {
    for (let gleichfarbigeGruppe of this.gleichfarbigeGruppen) {
      for (let koordinatenpaar of gleichfarbigeGruppe) {
        if (zugKoordinaten[0] == koordinatenpaar[0] && 
            zugKoordinaten[1] == koordinatenpaar[1]) {
          return gleichfarbigeGruppe;
        }
      }
    }
  }

}

// Objekte der Klasse Spielzustand repräsentieren das Spielfeld und die
// darauf befindlichen Steine. Ein Zug verändert nicht den Spielzustand,
// sondern liefert einen modifizierten Spielzustand zurück.
class Spielzustand {
  
  constructor(spielzustand) {
    this.nSpalten = 10;
    this.nZeilen = 10;
    this.nSorten = 3;
    this.zellen = undefined;
    this.zugArchiv = [];
    this.punkte = 0;
    this.potential = 0;
    this.moeglicheZuege = undefined;
    
    // Ein im Konstruktorargument übergebener Spielzustand wird kopiert.
    // Andernfalls repräsentiert der erzeugte Spielzustand ein neues Spiel.
    if(!spielzustand) {
      this.initialisiereNeu();
    } else {
      this.initialisiereKopie(spielzustand);
    }
  }
  
  // Spielzustand initialisieren, der ein neues Spiel repäsentiert
  initialisiereNeu(){
    this.zellen = erzeugeMatrix(this.nZeilen,
                                this.nSpalten, 
                                () => 1 + floor(random(this.nSorten)));
    this.aktualisiereSpielzuege();
  }

  // Spielzustand initialisieren, der eine Kopie eines vorhandenen
  // Spielzustandes ist. Spielzustände werden in dieser Anwendung
  // nur _vor_ einem Zug kopiert. Daher werden moeglicheZuege und
  // potential _nicht_ mitkopiert, da diese Eigenschaften sich mit
  // einem Zug ohnehin ändern.
  initialisiereKopie(spielzustand) {
    
    // kopiere Zellen
    this.zellen = [];
    for (let i = 0; i < this.nZeilen; i++) {
      this.zellen[i] = spielzustand.zellen[i].slice();
    }
    
    // kopiere Zugarchiv
    this.zugArchiv = [];
    for (let i = 0; i < spielzustand.zugArchiv.length; i++) {
      this.zugArchiv[i] = spielzustand.zugArchiv[i].slice();
    }

    // kopiere Zugmöglichkeiten
    this.moeglicheZuege = [];
    for (let i = 0; i < this.moeglicheZuege.length; i++) {
      this.moeglicheZuege[i] = spielzustand.moeglicheZuege[i].slice();
    }
    
    // kopiere Punktestand
    this.punkte = spielzustand.punkte;
  }

  // Schnittstelle: Führt Zug aus.
  // Ein Zug verändert den Spielzustand nicht, sondern liefert einen
  // modifizierten Spielzustand, sofern der Zug gültig ist, ansonsten den
  // ursprünglichen und unveränderten Spielzustand.
  zug(zugKoordinaten) {
    let resultat = this;
    
    // Das Objekt this.moeglicheZuege liefert eine gleichfarbige Gruppe,
    // wenn der Zug gültig ist
    const gleichfarbigeGruppe = this.moeglicheZuege.suche(zugKoordinaten);

    // Wenn der Zug gültig ist...
    if (gleichfarbigeGruppe) {
      // Spielzustand kopieren...
      resultat = new Spielzustand(this);
      // Zug auf der Kopie ausführen...
      resultat.entferneSteine(gleichfarbigeGruppe);
      resultat.spaltenAufruecken();
      resultat.punkte += gleichfarbigeGruppe.length;
      resultat.zugArchiv.push(zugKoordinaten);
      // Gültige Spielzüge für den neuen Spielzustand ermitteln
      resultat.aktualisiereSpielzuege();
    }

    return resultat;
  }

  // Schnittstelle: Gibt es zumindest einen gültigen Zug?
  zugIstMoeglich() {
    return this.moeglicheZuege.length > 0;
  }

  // Schnittstelle: Liefert die Bewertung des Spielzustandes
  bewertung(){
    return this.punkte + this.potential;
  }

  // Ermittelt die gültigen Spielzüge
  aktualisiereSpielzuege() {
    let kandidaten = [];
    let potential = 0;
    this.moeglicheZuege = new Spielzuege();

    // Alle besetzten Zellen sind Kandidaten
    for (let zeile = 0; zeile < this.nZeilen; zeile++) {
      for (let spalte = 0; spalte < this.nSpalten; spalte++) {
        if (!this.farbe([zeile, spalte]) == 0) {
          kandidaten.push([zeile, spalte]);  
        }
      }
    }
    
    // Wir starten bei Position 1
    let position = 0;
    let kandidat = kandidaten[position];
    
    // Solange es noch Kandidaten gibt...
    while (kandidat){
      const gleichfarbigeGruppe = this.gleichfarbigeGruppe(kandidat);
      // Wenn der Kandidat zu einer gleichfarbigen Gruppe gehört...
      if (gleichfarbigeGruppe) {
        // Den Kandidaten zu den möglichen Zügen hinzufügen...
        this.moeglicheZuege.push(gleichfarbigeGruppe);
        potential += gleichfarbigeGruppe.length;
        // Alle Zellen der gleichfarbigen Gruppe aus der Kandidatenliste
        // entfernen, weil sonst Züge mit identischem Ergebnis mehrfach
        // vorkommen würden
        kandidaten = kandidaten.filter(zug => {
          for (let zelle of gleichfarbigeGruppe) {
            if (this.koordinatenSindGleich(zelle, zug)) {
              return false;
            }
          }
          return true;
        });
      }
      position += 1;
      kandidat = kandidaten[position];
    }
    // Potential aktualisieren (Potential = Punkte, die man bekommen würde, 
    // wenn alle gültigen Züge gleichzeitig ausgeführt würden)
    this.potential = potential;
  }
  
  // Stößt die Suche nach einer gleichfarbigen Gruppe an, ausgehend von 
  // zugKoordinaten
  gleichfarbigeGruppe(zugKoordinaten) {
    const farbe = this.farbe(zugKoordinaten);
    if (farbe == 0) {
      return false;
    }
    const zellenGruppe = this.gleichfarbigeGruppeSuchen(farbe, [zugKoordinaten]);
    if (zellenGruppe.length > 2) {
      return zellenGruppe;
    } else {
      return false;
    }
  }

  // Rekursive Funktion zur Suche nach gleichfarbigen Gruppen
  gleichfarbigeGruppeSuchen(farbe, besuchen, besucht=[], gefunden=[]){
    let besuchenNeu = [];
    let resultat;

    for (let zelle of besuchen) {
      if (this.gruppeEnthaelt(besucht, zelle)) {
        continue;
      }
      const nachbarn = this.nachbarn(zelle);
      const gleichfarbigeNachbarn = this.filterNachFarbe(nachbarn, farbe);
      besuchenNeu = besuchenNeu.concat(gleichfarbigeNachbarn);
      gefunden = gefunden.concat(gleichfarbigeNachbarn);
    }

    besucht = besucht.concat(besuchen);
    besucht = this.entferneDoppelte(besucht);
    gefunden = this.entferneDoppelte(gefunden);
    
    if (besuchen.length == 0) {
      resultat = gefunden;
    } else {
      resultat = this.gleichfarbigeGruppeSuchen(farbe,
                                   besuchenNeu,
                                   besucht,
                                   gefunden);
    }

    return resultat;
  }

  // Liefert die Koordinaten der benachbarten Zellen
  nachbarn(zugKoordinaten) {
    const zeile = zugKoordinaten[0];
    const spalte = zugKoordinaten[1];
    const resultat = [];

    console.assert(spalte < this.nSpalten && zeile < this.nZeilen, 
                  "Ungültige Koordinaten für Spielfeld.nachbarn()");

    resultat.push(zugKoordinaten);

    if (spalte > 0){
      resultat.push([zeile, spalte-1]);
    }

    if (zeile > 0){
      resultat.push([zeile-1, spalte]);
    }
 
    if (spalte < this.nSpalten-1) {
      resultat.push([zeile, spalte+1]);
    }

    if (zeile < this.nZeilen-1) {
      resultat.push([zeile+1, spalte]);
    }

    return resultat;
  }

  // Entfernt die Koordiaten aller Zellen aus zellenGruppe, die nicht
  // der farbe entsprechen
  filterNachFarbe(zellenGruppe, farbe) {
    return zellenGruppe.filter(pos => this.farbe(pos) == farbe);
  }
  
  // Schnittstelle: liefert die Farbe einer Zelle
  farbe(zelle){
    const zeile = zelle[0];
    const spalte = zelle[1];
    return this.zellen[zeile][spalte];
  }
  
  // Entfernt alle in der zellenGruppe enthaltenen Steine aus dem Spielfeld
  entferneSteine(zellenGruppe) {
    zellenGruppe.sort((zelle1, zelle2) => zelle1[0]-zelle2[0])

    const nZellen = zellenGruppe.length;
    for (let i = 0; i < nZellen; i++) {
      this.entferneStein(zellenGruppe[i]);
    }
  }

  // Entfernt einen einzelnen Stein aus dem Spielfeld
  entferneStein(zelle) {
    const zeile = zelle[0];
    const spalte = zelle[1];
    // Das "runterfallen" der über dem entfernten Stein liegenden Steine
    for (let idxZeile = zeile; idxZeile > 0; idxZeile --){
      this.zellen[idxZeile][spalte] = this.zellen[idxZeile-1][spalte];
    }
    this.zellen[0][spalte] = 0;
  }

  // Entfernt Steine aus der zellenGruppe, die dort doppelt vorkommen 
  entferneDoppelte(zellenGruppe){
    let resultat = [];
    const nZellen = zellenGruppe.length;
    for (let i = 0; i < nZellen; i++) {
      if (! this.gruppeEnthaelt(resultat, zellenGruppe[i])) {
        resultat.push(zellenGruppe[i]);
      }
    }
    return resultat;
  }

  // Ist zelle in zellenGruppe enthalten?
  gruppeEnthaelt(zellenGruppe, zelle) {
    const nZellen = zellenGruppe.length;
    for (let i = 0; i < nZellen; i++) {
      if (this.koordinatenSindGleich(zelle, zellenGruppe[i])) {
        return true;
      }
    }
    return false;
  }

  // Vergleicht zwei Koordinatenpaare
  koordinatenSindGleich(zelle1, zelle2){
    return zelle1[0] == zelle2[0] && zelle1[1] == zelle2[1];
  }
  
  // Rückt alle rechts von einer leeren Spalte befindliche Spalten auf
  spaltenAufruecken() {
    for (let spalte = this.nSpalten-1; spalte>=0; spalte--){
      if (this.spalteIstLeer(spalte)){
        this.spalteAufruecken(spalte);
      }
    }
  }
  
  // Rückt eine rechts von einer leeren Spalte befindliche Spalten auf
  spalteAufruecken(leereSpalte) {
    for (let spalte = leereSpalte+1; spalte <= this.nSpalten-1; spalte++) {
      for (let zeile = 0; zeile < this.nZeilen; zeile++) {
        this.zellen[zeile][spalte-1] = this.zellen[zeile][spalte];
        this.zellen[zeile][spalte] = 0;
      }
    }
  }

  // Stellt fest, ob eine Spalte leer ist
  spalteIstLeer(spalte){
    for (let zeile = 0; zeile < this.nZeilen; zeile++) {
      if (this.farbe([zeile, spalte]) != 0) {
        return false
      } 
    }
    return true;
  }


}