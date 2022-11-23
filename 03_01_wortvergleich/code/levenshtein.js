class Levenshtein {

  // Schnittstelle: Liefert die Editierdistanz zwischen zwei Strings
  editDistanz(stringA, stringB){
    const matrix = this.matrix(stringA, stringB);
    // Die Editierdistanz ist der Wert der unteren rechten Zelle der Matrix
    return matrix[stringB.length][stringA.length]
  }

  // Schnittstelle: Liefert die Levenshtein-Matrix für zwei gegebene Strings
  matrix(stringA, stringB){

    // Kosten der einzelnen Operationen
    const kostenEinfuegung = 1;
    const kostenLoeschung = 1;
    const kostenErsetzung = 1;

    const nSpalten = stringA.length + 1;
    const nZeilen = stringB.length + 1;

    const matrix = erzeugeMatrix(nZeilen, nSpalten);

    // Obere linke Zelle 0 setzen
    matrix[0][0] = 0;
    
    // Die Zellen der oberen Zeile mit 1, 2, 3... füllen
    for (let spalte=1; spalte<nSpalten; spalte++) {
      matrix[0][spalte] = spalte;
    }
    
    // Die Zellen der linken Spalte mit 1, 2, 3... füllen
    for (let zeile=1; zeile<nZeilen; zeile++) {
      matrix[zeile][0] = zeile;
    }
    
    // Die Werte der verbleibenden Zellen ermkitteln
    for(let zeile=1; zeile<nZeilen; zeile++){
      for (let spalte=1; spalte<nSpalten; spalte++){
        
        // Kosten der vorherigen Zustände 
        const kostenObenLinks = matrix[zeile-1][spalte-1];
        const kostenOben = matrix[zeile-1][spalte];
        const kostenLinks = matrix[zeile][spalte-1];

        let kostenVonObenLinks;
        
        // Ersetzungskosten fallen nur bei Ungleichheit der dieser Zelle 
        // zugerordneten Zeichen an
        if (this.vergleicheZeichen(stringA, stringB, spalte-1, zeile-1)) {
          kostenVonObenLinks = kostenObenLinks;
        } else {
          kostenVonObenLinks = kostenObenLinks + kostenErsetzung;
        }

        const minimaleKosten = Math.min(kostenVonObenLinks,
                                        kostenOben+kostenLoeschung,
                                        kostenLinks+kostenEinfuegung);

        // Minmalen Kosten in die entsprechende Zelle eintragen
        matrix[zeile][spalte] = minimaleKosten;
      }
    }

    return matrix;
  }

  // Ermittelt, ob die Zeichen in str1 und str2 an den Positionen 
  // posA und posB gleich sind
  vergleicheZeichen(stringA, stringB, posA, posB){
    return stringA.charAt(posA) == stringB.charAt(posB);
  }

  // Schnittstelle: Matrix als String-Darstellung für GUI
  matrixAlsString(stringA, stringB){

    const matrix = this.matrix(stringA, stringB);
                                    
    let anzahlSpalten = stringA.length + 2;
    let anzahlZeilen = stringB.length + 2;
    
    let resultat = erzeugeMatrix(anzahlZeilen, anzahlSpalten, "  ");
  
    for(let spalte=2; spalte<anzahlSpalten; spalte++){
      resultat[0][spalte] = stringA.charAt(spalte-2).padStart(2, ' ');
    }
  
    for(let zeile=2; zeile<anzahlZeilen; zeile++){
      resultat[zeile][0] = stringB.charAt(zeile-2).padStart(2, ' ');
    }
  
    for(let spalte=1; spalte<anzahlSpalten; spalte++){
      for(let zeile=1; zeile<anzahlZeilen; zeile++){
        let eintragAlsString = str(matrix[zeile-1][spalte-1]);
        eintragAlsString = eintragAlsString.padStart(2, ' ');
        resultat[zeile][spalte] = eintragAlsString;
      }
    }
  
    resultat = matrixAlsString(resultat, '\n', ' ');
  
    return resultat;
  }

}