# Fotos de la sala

Marco digital familiar: la familia sube fotos desde el celular (PWA) y la iPad vieja (iOS 9.3.6) las muestra en carrusel todo el día.

## Archivos

| Archivo | Para qué sirve |
|---|---|
| `index.html` | App de subida (celulares). Subir fotos + galería con botón de borrar |
| `pantalla.html` | Pantalla de la iPad. JavaScript ES5 puro, sin librerías |
| `config.js` | `projectId` y `apiKey` de Firebase, intervalo y horario |
| `firestore.rules` | Reglas de seguridad para pegar en Firebase |
| `CODIGO_FAMILIAR.txt` | El código secreto. **No subir a GitHub** |
| `manifest.webmanifest`, `sw.js`, `icon-*.png` | Para instalarla como app |

## Cómo funciona

- Cada foto se reduce en el celular a 1600 px (~220 KB) y se guarda como un documento en Firestore.
- El "código familiar" es el nombre de la colección. Va en el link (`#c=fam_...`), no en el código, y las reglas solo abren esa colección.
- La iPad pide la lista de fotos (solo ids), baja **una foto a la vez** y precarga la siguiente. Cada 5 min revisa si hay nuevas, y esas se muestran primero.
- De noche (23:00 a 07:00, se cambia en `config.js`) la pantalla queda en negro y no gasta datos.

## Puesta en marcha

### 1. Firebase (plan gratis Spark, sin tarjeta)
1. console.firebase.google.com → **Agregar proyecto** (desactiva Analytics).
2. **Compilación → Firestore Database → Crear base de datos** → modo **producción**, región `us-west` (o la más cercana).
3. Pestaña **Reglas** → borra todo, pega el contenido de `firestore.rules` → **Publicar**.
4. ⚙️ **Configuración del proyecto → Tus apps → `</>` (Web)** → registra una app y copia `projectId` y `apiKey`.
5. Pégalos en `config.js`.

### 2. Publicar en GitHub Pages
1. Repositorio nuevo, por ejemplo `chokorad/fotos-sala`.
2. Sube **solo**: `index.html`, `pantalla.html`, `config.js`, `manifest.webmanifest`, `sw.js` y los `icon-*.png`.
3. ⚠️ **No subas `CODIGO_FAMILIAR.txt` ni `firestore.rules`**: el repo es público y ahí está el código.
4. Settings → Pages → Deploy from branch → `main` / root.

### 3. Los links (reemplaza con tu código)
- Familia (celulares): `https://chokorad.github.io/fotos-sala/#c=<CODIGO>`
- iPad: `https://chokorad.github.io/fotos-sala/pantalla.html#c=<CODIGO>`

Pasa el link de subida por WhatsApp. En el celular: Compartir → **Agregar a pantalla de inicio** (iPhone) o menú ⋮ → **Instalar app** (Android).

### 4. La iPad
1. Safari → abre el link de la iPad → Compartir → **Agregar a pantalla de inicio** → ábrela desde ese ícono (pantalla completa).
2. Ajustes → General → **Bloqueo automático: Nunca**. Déjala conectada al cargador.
3. Opcional: **Acceso guiado** (Ajustes → General → Accesibilidad; luego triple clic al botón de inicio con la app abierta) para que nadie salga por accidente.

## Límites del plan gratis (revisar de vez en cuando)
- Firestore: 1 GiB guardados (~3,000 fotos), 50K lecturas/día, 10 GiB de descarga al mes.
- Con una foto por minuto, 16 h al día, la iPad baja ~4 a 6 GiB al mes.
- Si se llena: borra fotos desde la pestaña Galería, o sube el proyecto al plan Blaze.

## Si algo falla
- Pantalla dice "Firebase rechazó el acceso": las reglas no están publicadas o el código del link no coincide con el de las reglas.
- "Falta el código familiar": abre el link completo con `#c=...` y vuelve a agregarlo a la pantalla de inicio.
- La iPad no carga nada: revisa que tenga Wi-Fi y que la hora esté correcta (Ajustes → General → Fecha y hora → Automáticamente).
