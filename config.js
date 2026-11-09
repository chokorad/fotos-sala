// Configuración de Firebase (estos valores NO son secretos: la seguridad la dan las reglas de Firestore
// y el código familiar que va en el link, no en este archivo).
window.FOTOS_CONFIG = {
  projectId: "fotos-sala-b2ff0",
  apiKey: "AIzaSyARskmv80s2Axhud2Z2SgxlB36pxAZP6iE",

  // Pantalla de la iPad
  intervaloSegundos: 60,   // cada cuántos segundos cambia la foto
  horaEncender: 7,         // la pantalla se apaga (negro) de noche: desde esta hora se muestran fotos
  horaApagar: 23,          // ...hasta esta hora (formato 24 h)
  revisarNuevasMin: 5,     // cada cuántos minutos busca fotos nuevas
  fondoDifuso: true        // fondo difuminado con los colores de la foto (false = barras negras)
};
