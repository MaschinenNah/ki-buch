// Liefert eine zufällige Farbe mit einer minimalen Heligkeit (von 0 bis 255)
// im Hex-Format.
// Dient im vorliegenden Projekt dazu, den einzelnen Wörtern Farben zuzuordnen,
// die für die Auswahl von Wörtern per Mausklick gebraucht werden.
function erzeugeZufallsFarbe(minimaleHelligkeit=0) {
  const min_ = Math.max(minimaleHelligkeit, 0) * 255;
  const max_ = 255;

  const r = Math.floor(Math.random() * (max_ - min_) + min_).toString(16);
  const g = Math.floor(Math.random() * (max_ - min_) + min_).toString(16);
  const b = Math.floor(Math.random() * (max_ - min_) + min_).toString(16);

  const color = '#' + padHex(r) + padHex(g) + padHex(b);

  return color;
}

// Füllt Hexadezimal-Strings, die Farben repräsentieren, wenn nötig, mit
// Nullen auf.
function padHex(color) {
  return (color.length === 1 ? "0" + color : color);
}

// Konvertiert rgb in hex-Farben.
function rgbToHex(rgbArray) {
  let hex = '#';
  for (let i = 0; i < 3; i++) {
      let hexPart = rgbArray[i].toString(16);
      hex += hexPart.length == 1 ? '0' + hexPart : hexPart;
  }
  return hex;
}