import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

export const processVideo = async (
  segments: any[],
  onProgress: (progress: number) => void
): Promise<string> => {
  const ffmpeg = new FFmpeg();
  ffmpeg.on('log', ({ message }) => console.log(message));

  try {
    onProgress(0);
    await ffmpeg.load({
      coreURL: await toBlobURL(`${window.location.origin}/ffmpeg/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${window.location.origin}/ffmpeg/ffmpeg-core.wasm`, 'application/wasm')
    });

    onProgress(10);
    const concatFile = 'concat.txt';
    let concatContent = '';

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      const videoData = segment.customVideo
        ? new Uint8Array(segment.customVideo)
        : await fetchFile(segment.video);

      await ffmpeg.writeFile(`input${i}.mp4`, videoData);
      concatContent += `file 'input${i}.mp4'\n`;
      onProgress(10 + Math.round((i + 1) / segments.length * 20));
    }

    await ffmpeg.writeFile(concatFile, concatContent);

    let progressTimeout: NodeJS.Timeout | undefined;
    const startTime = Date.now();

    ffmpeg.on('progress', ({ progress }) => {
      if (progressTimeout) clearTimeout(progressTimeout);
      const progressValue = Math.min(30 + Math.round(progress * 60), 90);
      onProgress(progressValue);
      progressTimeout = setTimeout(() => {
        if (Date.now() - startTime > 30000) {
          onProgress(95); 
        }
      }, 1000);
    });

    await ffmpeg.exec([
      '-f', 'concat',
      '-safe', '0',
      '-i', concatFile,
      '-c', 'copy',
      'output.mp4'
    ]);

    if (progressTimeout) clearTimeout(progressTimeout);

    const data = await ffmpeg.readFile('output.mp4') as Uint8Array;

    segments.forEach((_, i) => {
      try {
        ffmpeg.unmount(`input${i}.mp4`);
      } catch (e) {
        console.warn('Cleanup error:', e);
      }
    });

    try {
      ffmpeg.unmount('output.mp4');
      ffmpeg.unmount(concatFile);
    } catch (e) {
      console.warn('Cleanup error:', e);
    }

    onProgress(100);
    const blob = new Blob([data], { type: 'video/mp4' });
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('FFmpeg processing error:', error);
    throw error;
  }
};