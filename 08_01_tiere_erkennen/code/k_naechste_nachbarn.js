class KNN {

  constructor(datenpunkte) {
    this.datenpunkte = datenpunkte;
  }

  klassifiziere(datenpunktA, k) {
    const nachbarn = this.nachbarn(datenpunktA, k);
    const zaehlung = this.zaehlung(nachbarn);

    if (zaehlung.length == 1 || zaehlung[0][1] > zaehlung[1][1]) {
      datenpunktA.spezies = zaehlung[0][0];
    } else {
      datenpunktA.spezies = "unbekannt";
    }
    return datenpunktA;
  }

  nachbarn(datenpunktA, k) {
    this.datenpunkte.sort((L, R) => 
      this.distanz(datenpunktA, L) - this.distanz(datenpunktA, R));
    return datenpunkte.slice(0, k);
  }

  distanz(datenpunktA, datenpunktB) {
    const deltaX = datenpunktA.niedlichkeit - datenpunktB.niedlichkeit;
    const deltaY = datenpunktA.flauschigkeit - datenpunktB.flauschigkeit;
    return sqrt(deltaX*deltaX + deltaY*deltaY);
  }

  zaehlung(nachbarn) {
    const zaehlung = {};

    for (let datenpunkt of nachbarn) {
      const spezies = datenpunkt.spezies;
      if (!zaehlung[spezies]) {
        zaehlung[spezies] = 1;
      } else {
        zaehlung[spezies] += 1;
      }
    }

    const alsArray = Object.entries(zaehlung);
    alsArray.sort((L, R) => R[1] - L[1]);
    return alsArray;
  }



}