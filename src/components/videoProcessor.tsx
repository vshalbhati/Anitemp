import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

const processSegmentWithTransition = async (ffmpeg: FFmpeg, segment: any, index: number, duration: number) => {
  try {
    const outputFile = `processed${index}.mp4`;
    await ffmpeg.exec([
      '-i', `normalized${index}.mp4`,
      '-c:v', 'libx264',
      '-preset', 'ultrafast',
      '-crf', '28',
      '-c:a', 'copy',
      '-vf', getTransitionFilter(segment.transition, duration),
      '-movflags', '+faststart',
      '-threads', '0',
      '-y',
      outputFile
    ]);
    return true;
  } catch (e) {
    console.error(`Error processing segment ${index}:`, e);
    return false;
  }
};

// Memory cleanup is handled in the cleanup function

export const processVideo = async (
  segments: any[],
  onProgress: (progress: number) => void
): Promise<string> => {
  let progressTimeout: NodeJS.Timeout | undefined;
  let ffmpeg: FFmpeg | null = new FFmpeg();
  ffmpeg.on('log', ({ message }) => console.log(message));

  try {
    onProgress(0);
    await ffmpeg.load({
      coreURL: await toBlobURL(`${window.location.origin}/ffmpeg/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${window.location.origin}/ffmpeg/ffmpeg-core.wasm`, 'application/wasm')
    });

    onProgress(10);
    
    // First, process each video with its transition
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      const videoData = segment.customVideo
        ? new Uint8Array(segment.customVideo)
        : await fetchFile(segment.video);

      await ffmpeg.writeFile(`input${i}.mp4`, videoData);
      
      // First pass: Normalize the input video
      await ffmpeg.exec([
        '-i', `input${i}.mp4`,
        '-c:v', 'libx264',
        '-preset', 'ultrafast', // Change from medium to ultrafast
        '-crf', '28', // Slightly reduce quality for better speed (23 -> 28)
        '-c:a', 'aac',
        '-b:a', '128k',
        '-movflags', '+faststart',
        '-threads', '0', // Use all available threads
        '-y',
        `normalized${i}.mp4`
      ]);

      try {
        await ffmpeg.exec(['-i', `normalized${i}.mp4`]);
      } catch (e) {
        console.error(`Failed to verify normalized file ${i}:`, e);
        continue;
      }
      
      onProgress(10 + Math.round((i + 1) / segments.length * 20));
    }

    const transitionPromises = segments.map((segment, i) => {
      if (segment.transition && ffmpeg) {
        return processSegmentWithTransition(ffmpeg, segment, i, 1);
      }
      return Promise.resolve(true);
    });

    await Promise.all(transitionPromises);

    // Create concat file
    const concatContent = segments.map((_, i) => `file processed${i}.mp4`).join('\n');
    await ffmpeg.writeFile('concat.txt', concatContent);

    // Final concatenation
    await ffmpeg.exec([
      '-f', 'concat',
      '-safe', '0',
      '-i', 'concat.txt',
      '-c:v', 'libx264',
      '-preset', 'ultrafast',
      '-crf', '28',
      '-c:a', 'copy',
      '-movflags', '+faststart',
      '-threads', '0',
      '-y',
      'output.mp4'
    ]);

    if (progressTimeout) clearTimeout(progressTimeout);

    const cleanup = async () => {
      if (!ffmpeg) return;
      
      // Clean up input and processed files
      for (let i = 0; i < segments.length; i++) {
        try {
          await ffmpeg.deleteFile(`input${i}.mp4`);
          await ffmpeg.deleteFile(`processed${i}.mp4`);
        } catch (e) {
          console.warn(`Cleanup error for segment ${i}:`, e);
        }
      }

      // Clean up other files
      try {
        await ffmpeg.deleteFile('output.mp4');
        await ffmpeg.deleteFile('concat.txt');
      } catch (e) {
        console.warn('Cleanup error:', e);
      }

      // Terminate FFmpeg instance
      try {
        await ffmpeg.terminate();
        ffmpeg = null;
      } catch (e) {
        console.warn('FFmpeg termination error:', e);
      }
    };

    const data = await ffmpeg.readFile('output.mp4') as Uint8Array;
    await cleanup();

    onProgress(100);
    const blob = new Blob([data], { type: 'video/mp4' });
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('FFmpeg processing error:', error);
    throw error;
  }
};

const getTransitionFilter = (transition: string, duration: number): string => {
  switch (transition.toLowerCase()) {
    case 'fade':
      return `fade=t=in:st=0:d=${duration}`;
    case 'dissolve':
      return `fade=t=in:st=0:d=${duration}:alpha=1`;
    case 'wipeleft':
      return `crop=w='min(iw,t/${duration}*iw)':h=ih:x=0:y=0`;
    case 'wiperight':
      return `crop=w='min(iw,t/${duration}*iw)':h=ih:x='iw-min(iw,t/${duration}*iw)':y=0`;
    case 'slideleft':
      return `pad=w=iw*2:h=ih:x=iw,overlay=x='if(gte(t,0),-(iw)+t*iw/${duration},NAN)'`;
    case 'slideright':
      return `pad=w=iw*2:h=ih,overlay=x='if(gte(t,0),iw-t*iw/${duration},NAN)'`;
    // Add other transitions...
    default:
      return '';
  }
};