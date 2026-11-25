import { GIFEncoder, quantize, applyPalette } from './vendor/gifenc.mjs';

const MAX_DATA_URL = 850000;
const COLOR_FORMAT = 'rgb444';

class FrameReadError extends Error {}

function seekFrame(video, time) {
  return new Promise((resolve, reject) => {
    const cleanup = () => {
      clearInterval(poll);
      clearTimeout(timer);
      video.removeEventListener('seeked', onSeek);
      video.removeEventListener('loadeddata', onSeek);
      video.removeEventListener('error', onError);
    };
    const onSeek = () => {
      if (video.seeking || video.readyState < 2 || Math.abs(video.currentTime - time) > 0.05) return;
      cleanup();
      resolve();
    };
    const onError = () => {
      cleanup();
      reject(new FrameReadError('No se pudo buscar un fotograma.'));
    };
    const poll = setInterval(onSeek, 40);
    const timer = setTimeout(onError, 4000);
    video.addEventListener('seeked', onSeek);
    video.addEventListener('loadeddata', onSeek);
    video.addEventListener('error', onError);
    try {
      if (Math.abs(video.currentTime - time) > 0.001) video.currentTime = time;
      onSeek();
    } catch {
      onError();
    }
  });
}

// Some mobile decoders stall when asked to seek repeatedly while paused.
async function captureDuringPlayback(video, inicio, segundos, frames, capture, progress) {
  const images = [];
  const fail = 'El video abre, pero no se pudieron capturar sus fotogramas. Prueba con una copia exportada en MP4 (H.264).';
  try {
    video.currentTime = inicio;
    await new Promise((resolve, reject) => {
      let frameRequest;
      let settled = false;
      const cleanup = () => {
        settled = true;
        cancelAnimationFrame(frameRequest);
        clearTimeout(timer);
        video.removeEventListener('error', onError);
      };
      const onError = () => {
        cleanup();
        reject(new FrameReadError(fail));
      };
      const sample = () => {
        try {
          const elapsed = video.currentTime - inicio;
          if (!video.seeking && video.readyState >= 2 && elapsed >= 0) {
            const count = Math.min(frames, Math.floor(elapsed * frames / segundos + 0.5));
            if (images.length < count) {
              const image = capture();
              while (images.length < count) images.push(image);
              progress(images.length);
            }
          }
          if (images.length < frames) {
            frameRequest = requestAnimationFrame(sample);
          } else {
            cleanup();
            resolve();
          }
        } catch {
          onError();
        }
      };
      const timer = setTimeout(onError, (segundos + 8) * 1000);
      video.addEventListener('error', onError);
      Promise.resolve(video.play()).then(() => {
        if (settled) return;
        frameRequest = requestAnimationFrame(sample);
      }, onError);
    });
    return images;
  } catch {
    throw new FrameReadError(fail);
  } finally {
    video.pause();
  }
}

export async function convertirClip(video, inicio, segundos, progreso) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  const preset = [{ lado: 480, fps: 8 }, { lado: 320, fps: 6 }, { lado: 224, fps: 4 }, { lado: 144, fps: 3 }];
  const centesimas = Math.round(segundos * 100);
  const capture = () => {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  };
  let playback = false;

  for (const { lado, fps } of preset) {
    if (playback && lado > 320) continue;
    const escala = Math.min(1, lado / Math.max(video.videoWidth, video.videoHeight));
    canvas.width = Math.max(1, Math.round(video.videoWidth * escala));
    canvas.height = Math.max(1, Math.round(video.videoHeight * escala));
    const frames = Math.max(1, Math.round(segundos * fps));
    const report = (count) => progreso(count, frames, lado);
    let recorded = playback ? await captureDuringPlayback(video, inicio, segundos, frames, capture, report) : null;
    let gif = GIFEncoder();

    for (let i = 0; i < frames; i += 1) {
      if (!recorded) {
        try {
          await seekFrame(video, inicio + (i + 0.5) * segundos / frames);
        } catch (error) {
          if (!(error instanceof FrameReadError)) throw error;
          playback = true;
          recorded = await captureDuringPlayback(video, inicio, segundos, frames, capture, report);
          gif = GIFEncoder();
          i = 0;
        }
      }
      const rgba = recorded ? recorded[i] : capture();
      const palette = quantize(rgba, 128, { format: COLOR_FORMAT });
      const pixels = applyPalette(rgba, palette, COLOR_FORMAT);
      const delay = (Math.round((i + 1) * centesimas / frames) - Math.round(i * centesimas / frames)) * 10;
      gif.writeFrame(pixels, canvas.width, canvas.height, { palette, delay, repeat: 0 });
      if (!recorded) report(i + 1);
      if (gif.bytesView().length * 4 / 3 > MAX_DATA_URL) break;
      if (i === frames - 1) {
        gif.finish();
        const bytes = gif.bytesView();
        let binary = '';
        for (let offset = 0; offset < bytes.length; offset += 8192) {
          binary += String.fromCharCode(...bytes.subarray(offset, offset + 8192));
        }
        const data = 'data:image/gif;base64,' + btoa(binary);
        if (data.length < MAX_DATA_URL) return data;
      }
    }
  }
  throw new Error('El GIF quedó muy pesado. Elige un fragmento más corto.');
}
