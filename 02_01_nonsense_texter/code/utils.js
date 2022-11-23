// Liefert einen String, in dem alle in der Regel paarweise auftretenden
// Zeichen wie Klammern oder Anführungszeichen entfernt wurden
function entfernePaarigeZeichen(string){
  return string.replaceAll(/["›‹»«„“\(\)\[\]\{\}]/g, '');
}