import { GIFEncoder, quantize, applyPalette } from './vendor/gifenc.mjs';

const MAX_DATA_URL = 850000;
const COLOR_FORMAT = 'rgb444';

function seekFrame(video, time) {
  return new Promise((resolve, reject) => {
    const cleanup = () => {
      clearTimeout(timer);
      video.removeEventListener('seeked', onSeek);
      video.removeEventListener('loadeddata', onSeek);
      video.removeEventListener('error', onError);
    };
    const onSeek = () => {
      if (video.seeking || video.readyState < 2) return;
      cleanup();
      resolve();
    };
    const onError = () => {
      cleanup();
      reject(new Error('No se pudo leer el video. Prueba con un MP4.'));
    };
    const timer = setTimeout(onError, 12000);
    video.addEventListener('seeked', onSeek);
    video.addEventListener('loadeddata', onSeek);
    video.addEventListener('error', onError);
    try {
      if (Math.abs(video.currentTime - time) > 0.001) video.currentTime = time;
      else onSeek();
    } catch {
      onError();
    }
  });
}

export async function convertirClip(video, inicio, segundos, progreso) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  const preset = [{ lado: 480, fps: 8 }, { lado: 320, fps: 6 }, { lado: 224, fps: 4 }, { lado: 144, fps: 3 }];

  for (const { lado, fps } of preset) {
    const escala = Math.min(1, lado / Math.max(video.videoWidth, video.videoHeight));
    canvas.width = Math.max(1, Math.round(video.videoWidth * escala));
    canvas.height = Math.max(1, Math.round(video.videoHeight * escala));
    const frames = Math.max(1, Math.round(segundos * fps));
    const centesimas = Math.round(segundos * 100);
    const gif = GIFEncoder();
    for (let i = 0; i < frames; i += 1) {
      await seekFrame(video, inicio + (i + 0.5) * segundos / frames);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const rgba = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      const palette = quantize(rgba, 128, { format: COLOR_FORMAT });
      const pixels = applyPalette(rgba, palette, COLOR_FORMAT);
      const delay = (Math.round((i + 1) * centesimas / frames) - Math.round(i * centesimas / frames)) * 10;
      gif.writeFrame(pixels, canvas.width, canvas.height, { palette, delay, repeat: 0 });
      progreso(i + 1, frames, lado);
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
