# Tests

- Check the inline script in pantalla.html and all of config.js with Acorn using ECMAScript 5 mode.
- On a phone, select a video under a minute, move the start slider, generate a GIF, and confirm the preview loops. Try a video at least 60 seconds long and confirm the editor rejects it.
- With the family code, upload the GIF and open the gallery. Confirm it appears beside ordinary photos. Delete the test GIF after verifying it on the iPad.
- On the iPad with iOS 9.3.6 during active hours, reopen the frame. Confirm the GIF starts without a tap, loops, and advances to the next slide on the normal schedule.
- Exercise a decoder that stalls on paused seeks. Confirm GIF preview can recover through muted playback and that playback pauses at the end of capture.

- Start a GIF preview, switch apps or lock the phone, wait longer than the seek timeout, and return. Confirm the same trim retries automatically and eventually shows the preview.
