import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import axios from 'axios';

// --- Método 1: yt-dlp (El más robusto) ---
export async function downloadWithYtdlp(url, isVideo = false) {
  const tempDir = './temp';
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

  const format = isVideo ? 'mp4' : 'mp3';
  const tempPath = path.join(tempDir, `${Date.now()}.${format}`);

  const ytdlpFormat = isVideo
    ? `-f "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best" --merge-output-format mp4`
    : `-f bestaudio --extract-audio --audio-format mp3 --audio-quality 0`;

  const command = `yt-dlp -o "${tempPath}" ${ytdlpFormat} "${url}"`;

  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        if (stderr.includes('not found') || stderr.includes('no se reconoce')) {
            return reject(new Error('yt-dlp no está instalado o no se encuentra en el PATH.'));
        }
        return reject(error);
      }
      if (!fs.existsSync(tempPath) || fs.statSync(tempPath).size === 0) {
        return reject(new Error('El archivo descargado por yt-dlp está vacío o no existe.'));
      }
      // Devolvemos la ruta al archivo, no el buffer, para manejarlo fuera.
      resolve(tempPath);
    });
  });
}

// --- Método 2: ddownr (API de oceansaver.in) ---
export async function downloadWithDdownr(url, isVideo = false) {
    const format = isVideo ? '720' : 'mp3';
    const downloadConfig = {
        method: "GET",
        url: `https://p.oceansaver.in/ajax/download.php?format=${format}&url=${encodeURIComponent(url)}`,
    };
    const downloadResponse = await axios.request(downloadConfig);

    if (!downloadResponse.data?.success || !downloadResponse.data.id) {
        throw new Error("ddownr API: No se pudo iniciar la conversión.");
    }

    const progressConfig = {
        method: "GET",
        url: `https://p.oceansaver.in/ajax/progress.php?id=${downloadResponse.data.id}`,
    };

    for (let i = 0; i < 20; i++) { // Intentar por un máximo de 100 segundos
        const progressResponse = await axios.request(progressConfig);
        if (progressResponse.data?.success && progressResponse.data.progress === 1000) {
            // Devolvemos la URL para descargar el buffer fuera de esta función.
            return progressResponse.data.download_url;
        }
        await new Promise(resolve => setTimeout(resolve, 5000));
    }

    throw new Error("ddownr API: El tiempo de conversión ha expirado.");
}

// --- Método 3: TheAdonix API (del código de artista) ---
export async function downloadWithAdonix(url) {
    const apiUrl = `https://theadonix-api.vercel.app/api/ytmp3?url=${encodeURIComponent(url)}`;
    const response = await axios.get(apiUrl);
    const result = response.data;
    if (!result.status || !result.data?.download) {
        throw new Error("Adonix API: No se pudo obtener el enlace de descarga.");
    }
    return result.data.download;
}