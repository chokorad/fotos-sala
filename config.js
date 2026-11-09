// Configuración de Firebase (estos valores NO son secretos: la seguridad la dan las reglas de Firestore
// y el código familiar que va en el link, no en este archivo).
window.FOTOS_CONFIG = {
  projectId: "PEGA_AQUI_TU_PROJECT_ID",
  apiKey: "PEGA_AQUI_TU_API_KEY",

  // Pantalla de la iPad
  intervaloSegundos: 60,   // cada cuántos segundos cambia la foto
  horaEncender: 7,         // la pantalla se apaga (negro) de noche: desde esta hora se muestran fotos
  horaApagar: 23,          // ...hasta esta hora (formato 24 h)
  revisarNuevasMin: 5      // cada cuántos minutos busca fotos nuevas
};
