class Umwelt {
  
  static AGENT = 7;
  static BLOCKADE = -1;
  static NORMAL = 0;
  static ZIEL = 1;
  
  constructor() {
    this.nZeilen = undefined;
    this.nSpalten = undefined;
    this.nZustaende = undefined;
    this.nAktionen = undefined;
    this.posAgent = undefined;
    this.posZiel = undefined;
    this.posBarrieren = undefined;
    this.nEpisoden = undefined;
    this.neueEpisode = undefined;
    
    this.initialisiere();
  }

  initialisiere() {
    this.nZeilen = 15;
    this.nSpalten = 15;
    this.nZustaende = this.nZeilen * this.nSpalten;
    this.nAktionen = 4;

    this.initialisiereAgent();

    this.initialisiereZiel();
    
    this.initialisiereBarrieren()
    
    this.nEpisoden = 0;

    this.neueEpisode = true;
  }

  initialisiereAgent() {
    this.posAgent = {};
    this.posAgent.zeile = floor(random(this.nZeilen));
    this.posAgent.spalte = 0;
  }

  initialisiereZiel() {
    this.posZiel = {};
    this.posZiel.zeile = floor(random(this.nZeilen));
    this.posZiel.spalte = this.nSpalten -1;
  }

  // Positioniert die drei Barrieren
  initialisiereBarrieren() {
    this.posBarrieren = [];
    const mittlereSpalte = floor(this.nSpalten / 2);
    this.initialisiereBarriere(mittlereSpalte-3, 3);
    this.initialisiereBarriere(mittlereSpalte, 3);
    this.initialisiereBarriere(mittlereSpalte+3, 3);
  }

  // Positioniert eine Barriere
  initialisiereBarriere(spalte, nLuecken) {
    const barrieren = [];
    for (let zeile = 0; zeile < this.nZeilen; zeile++) {
      const barriere = {}
      barriere.zeile = zeile;
      barriere.spalte = spalte;
      barrieren.push(barriere)
    }

    for (let i = 0; i < nLuecken; i++) {
      const pos = floor(random(1, this.nZeilen-3));
      barrieren.splice(pos, 1);
    }

    this.posBarrieren = this.posBarrieren.concat(barrieren);
  }

  // Schnittstelle: Führt Aktion aus und liefert eine modifizierte Umwelt
  aktion(aktionsNr) {

    if (this.posAgent.zeile == this.posZiel.zeile &&
      this.posAgent.spalte == this.posZiel.spalte) {
        // Das Ziel wurde erreicht, Agent wird an eine neue,
        // zufällige Startposition gesetzt
        this.initialisiereAgent();
        this.neueEpisode = true;
        this.nEpisoden += 1;
        return this;
    }
    
    // Übersetzung der Aktionsnummer in eine Aktion
    switch(aktionsNr) {
      
      case 0:
        this.hoch();
        break;
      
      case 1:
        this.runter();
        break;

      case 2:
        this.links();
        break;
        
      case 3:
        this.rechts();
        break;  
    }
     this.neueEpisode = false;
    return this;
    
  }

  // Die vier Aktionen...
  hoch() {
    let zeileNeu;
    const spalte = this.posAgent.spalte;
    if (this.posAgent.zeile != 0) {
      zeileNeu = this.posAgent.zeile-1;
      if (umwelt.zellenZustand(zeileNeu, spalte) != Umwelt.BLOCKADE) {
        this.posAgent.zeile = zeileNeu;
      }
    }
  }

  runter() {
    let zeileNeu;
    const spalte = this.posAgent.spalte;
    if (this.posAgent.zeile < this.nZeilen-1) {
      zeileNeu = this.posAgent.zeile + 1;
      if (umwelt.zellenZustand(zeileNeu, spalte) != Umwelt.BLOCKADE) {
        this.posAgent.zeile = zeileNeu;
      }
    }
  }

  links() {
    const zeile = this.posAgent.zeile;
    let spalteNeu;
    if (this.posAgent.spalte != 0) {
      spalteNeu = this.posAgent.spalte - 1;
      if (umwelt.zellenZustand(zeile, spalteNeu) != Umwelt.BLOCKADE) {
        this.posAgent.spalte = spalteNeu;
      }
    }
  }

  rechts() {
    const zeile = this.posAgent.zeile;
    let spalteNeu;
    if (this.posAgent.spalte < this.nSpalten-1) {
      spalteNeu = this.posAgent.spalte + 1;
      if (umwelt.zellenZustand(zeile, spalteNeu) != Umwelt.BLOCKADE) {
        this.posAgent.spalte = spalteNeu;
      }
    }
  }

  // Schnittstelle: liefert die aktuelle ZustandsNr
  zustandsNr() {
    return this.koordinateNachZustandsNr(this.posAgent.zeile, this.posAgent.spalte); 
  }
  
  // Schnittstelle: liefert die Zustandsnummer für eine Koordinate
  koordinateNachZustandsNr(zeile, spalte) {
    return zeile * this.nSpalten + spalte; 
  }
    
  // Schnittstelle: Liefert die aktuelle Belohnung
  belohnung() {
    if (this.posAgent.zeile == this.posZiel.zeile &&
      this.posAgent.spalte == this.posZiel.spalte) {
        return 100;
    }
    return 0;
  }
  
  // Schnittstelle: Liefert den Zustand einer Zelle,
  // also AGENT, ZIEL, BLOCKADE oder NORMAL
  zellenZustand(zeile, spalte) {

    if (this.posZiel.zeile == zeile && this.posZiel.spalte == spalte) {
      return Umwelt.ZIEL;
    }

    for (let pos of this.posBarrieren) {
      if (pos.zeile == zeile && pos.spalte == spalte) {
        return Umwelt.BLOCKADE;
      }
    }

    if (this.posAgent.zeile == zeile && this.posAgent.spalte == spalte) {
      return Umwelt.AGENT;
    }

    return Umwelt.NORMAL;
  }

}