let levenshtein;

function setup() {
  GUI.erzeugeGUI();
  levenshtein = new Levenshtein();
}

// Callback-Funktion für GUI.eingabeA.input() und GUI.eingabeB.input()
function eingabe() {
  const stringA = GUI.eingabeA.value();
  const stringB = GUI.eingabeB.value();
  const matrixAlsString = levenshtein.matrixAlsString(stringB, stringA);
  GUI.matrixMonitor.html(matrixAlsString);
  const distanz = levenshtein.editDistanz(stringB, stringA);
  GUI.distanzAusgabe.value(distanz);
}