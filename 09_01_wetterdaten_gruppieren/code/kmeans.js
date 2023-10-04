// Da der k-means-Clustering-Algorithmus in Kapitel 9 ausführlich diskutiert
// wird, stehen hier nur spärliche Kommentare.

class KMeansClustering {

  constructor(datenpunkte, k) {
    
    this.datenpunkte = datenpunkte;
    this.k = k;
    this.cluster = undefined;
    this.zentren = undefined;
    this.xMin = Number.MAX_VALUE;
    this.xMax = -Number.MAX_VALUE;
    this.yMin = Number.MAX_VALUE;
    this.yMax = -Number.MAX_VALUE;

    this.ermittleExtremwerte();
    this.initialisiereCluster(k);
    this.zentrenZufaelligSetzen();
    this.datenpunkteZuordnen();

    this.mittelwerteAktualisiert = false;
    this.punkteZugeordnet = true;
  }

  // Die Extremwerte werden für die GUI-Darstellung benötigt
  ermittleExtremwerte() {
    const alleX = this.datenpunkte.map((datenpunkt) => datenpunkt[0]);
    const alleY = this.datenpunkte.map((datenpunkt) => datenpunkt[1]);
    this.xMin = min(alleX);
    this.xMax = max(alleX);
    this.yMin = min(alleY);
    this.yMax = max(alleY);
  }

  // Schnittstelle: Wählt k Datenpunkte als Zentren aus
  zentrenZufaelligSetzen() {
    this.zentren = shuffle(this.datenpunkte).slice(0, this.k);
  }

  // Schnittstelle: Ordnet jeden Datenpunkt einem Cluster zu
  datenpunkteZuordnen() {
    this.initialisiereCluster();
    
    for (let datenpunkt of this.datenpunkte) {
      this.datenpunktZuordnen(datenpunkt);
    }
    this.punkteZugeordnet = true;
    this.zentrenAktualisiert = false;
  }
  
  // Zuordnung eines einzelnen Datenpunktes
  datenpunktZuordnen(datenpunkt) {
    let minDistanz = Number.MAX_VALUE;
    let clusterIdx;

    for (let idx in this.zentren) {
      const distanz = this.distanz(datenpunkt, this.zentren[idx]);
      if (distanz < minDistanz) {
        minDistanz = distanz;
        clusterIdx = idx;
      }
    }

    this.cluster[clusterIdx].push(datenpunkt);
  }

  // Erzeugt k leere Cluster
  initialisiereCluster() {
    this.cluster = [];
    for (let i = 0; i < this.k; i++) {
      this.cluster.push([]);
    }
  }

  // Liefert die Entfernung zwischen zwei Datenpunkten
  distanz(datenpunktA, datenpunktB) {
    const deltaX = datenpunktA[0] - datenpunktB[0];
    const deltaY = datenpunktA[1] - datenpunktB[1];
    return sqrt(pow(deltaX, 2) + pow(deltaY, 2));
  }

  // Schnittstelle: Berechnet die Mittelwerte (Schwerpunkte, Zentren)
  // aller Cluster
  zentrenNeuBerechnen() {
    for (let clusterIdx in this.cluster) {
      const mittelwert = this.mittelwert(this.cluster[clusterIdx]);
      this.zentren[clusterIdx] = mittelwert;
    }
    this.zentrenAktualisiert = true;
    this.punkteZugeordnet = false;
  }
  
  // Liefert den Mittelwert (Schwerpunkt, Zentrum) eines Clusters
  mittelwert(cluster) {
    const alleX = cluster.map((punkt) => punkt[0]);
    const alleY = cluster.map((punkt) => punkt[1]);
    const summeX = summe(alleX);
    const summeY = summe(alleY);
    const mittelwertX = summeX / cluster.length;
    const mittelwertY = summeY / cluster.length;
    return [mittelwertX, mittelwertY];
  }

}