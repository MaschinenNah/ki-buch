// Da der Minmax-Algorithmus in Kapitel 6 ausführlich diskutiert
// wird, stehen hier nur spärliche Kommentare.

class KI {

  static MINIMIERER = -1   // Mensch, schwarz
  static MAXIMIERER = 1    // Maschine, weiß

  minimax(spielzustand, suchtiefe) {
    
    if (suchtiefe == 0 || spielzustand.spielIstZuende()) {
      return {bewertung: spielzustand.bewertung()};
    }

    if (spielzustand.spieler == KI.MAXIMIERER) {
      return this.maximierer(spielzustand, suchtiefe);
    }

    if (spielzustand.spieler == KI.MINIMIERER) {
      return this.minimierer(spielzustand, suchtiefe);
    }

  }

  // Maschine
  maximierer(spielzustand, suchtiefe) {
    let maximum = -Infinity;
    let besterZug;
    const folgezustaende = this.folgezustaende(spielzustand);
    for (let folgezustand of folgezustaende) {
      const bewertung = this.minimax(folgezustand, suchtiefe-1).bewertung;
      if (bewertung > maximum) {
        maximum = bewertung;
        besterZug = folgezustand.letzterZug;
      }
    }
    return {bewertung: maximum, besterZug: besterZug};
  }
    
  // Mensch
  minimierer(spielzustand, suchtiefe) {
    let minimum = Infinity;
    let besterZug;
    const folgezustaende = this.folgezustaende(spielzustand);

    for (let folgezustand of folgezustaende) {
      const bewertung = this.minimax(folgezustand, suchtiefe-1).bewertung;
      if (bewertung < minimum) {
          besterZug = folgezustand.letzterZug;
          minimum = bewertung; 
      }
    }
    return {bewertung: minimum, besterZug: besterZug};
  }

  folgezustaende(spielzustand){
    const moeglicheZuege = spielzustand.moeglicheZuege;
    return moeglicheZuege.map(einZug => spielzustand.zug(einZug));
  }

}

class KIAlphaBeta {

  static MINIMIERER = -1   // Mensch, schwarz
  static MAXIMIERER = 1    // Maschine, weiß
  
  minimax(spielzustand,
          suchtiefe,
          alpha_ = -Infinity,
          beta = Infinity) {
    if (suchtiefe == 0 || spielzustand.spielIstZuende()) {
      return {bewertung: spielzustand.bewertung()};
    }

    if (spielzustand.spieler == KIAlphaBeta.MAXIMIERER) {
      return this.maximierer(spielzustand, suchtiefe, alpha_, beta);
    }

    if (spielzustand.spieler == KIAlphaBeta.MINIMIERER) {
      return this.minimierer(spielzustand, suchtiefe, alpha_, beta);
    }
  }

  // Maschine
  maximierer(spielzustand, suchtiefe, alpha_, beta) {
    let maximum = alpha_;
    let besterZug;
    const folgezustaende = this.folgezustaende(spielzustand);

    for (let folgezustand of folgezustaende) {
      const bewertung = this.minimax(folgezustand,
                                     suchtiefe-1,
                                     maximum,
                                     beta).bewertung;
      if (bewertung > maximum) {
        maximum = bewertung;
        besterZug = folgezustand.letzterZug;
        if (maximum >= beta) {
          break;
        }
      }

    }
    return {bewertung: maximum, besterZug: besterZug};
  }

  // Mensch
  minimierer(spielzustand, suchtiefe, alpha_, beta) {
    let minimum = beta;
    let besterZug;
    const folgezustaende = this.folgezustaende(spielzustand);

    for (let folgezustand of folgezustaende) {
      const bewertung = this.minimax(folgezustand,
                                     suchtiefe-1,
                                     alpha_,
                                     minimum).bewertung;
      if (bewertung < minimum) {
        minimum = bewertung;
        besterZug = folgezustand.letzterZug;
        if (minimum <= alpha_) {
          break;
        }
      }
    }
    return {bewertung: minimum, besterZug: besterZug};
  }

  folgezustaende(spielzustand){
    const moeglicheZuege = spielzustand.moeglicheZuege;
    return moeglicheZuege.map(einZug => spielzustand.zug(einZug));
  }

}