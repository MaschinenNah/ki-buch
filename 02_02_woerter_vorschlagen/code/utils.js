// Liefert ein Array, das alle in string enthaltenen "Wörter" enthält
function zerlegeInWoerter(string){
  return string.match(/[a-z0-9äáàâëéèêïíìîöóòôüúùûß]+/gi);
}

// Liefert das letzte Wort in einem String
function letztesWort(string){
  const alleWoerter = zerlegeInWoerter(string);
  if (alleWoerter){
    return alleWoerter[alleWoerter.length -1];
  }
}

// Liefert das letzte Zeichen in einem String
function letztesZeichen(string){
  return string[string.length-1];
}

// Liefert einen String, in dem alle doppelten Leerzeichen entfernt wurden
function entferneDoppelteLeerzeichen(string){
  return string.replaceAll(/\s\s+/g, " ");
}

// ...in dem alle Leerzeichen vor Satzzeichen entfernt wurden
function entferneLeerzeichenVorSatzzeichen(string){
  string = string.replaceAll(/\s+[\.\?:,!]/g, letztesZeichen);
  return string
}

// ...in dem alle Sonderzeichen entfernt wurden 
function entferneSonderzeichen(string){
  return string.replaceAll(/[^a-z0-9äáàâëéèêïíìîöóòôüúùûß ]+/gi, "");
}

