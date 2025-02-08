'use client';
import React, { useState, useEffect } from 'react';
import { Download, Film, Upload } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { processVideo } from '@/components/videoProcessor';

const Studio = () => {
  const [segments, setSegments] = useState<Array<{
    id: number;
    video: string;
    text: string;
    transition: string;
    customVideo: Uint8Array | null;
    previewUrl: string | null;
  }>>([
    {
      id: 1,
      video: '/default1.mp4',
      text: 'Intro Text',
      transition: 'fade',
      customVideo: null,
      previewUrl: null
    },
    {
      id: 2,
      video: '/default2.mp4',
      text: 'Middle Section',
      transition: 'slide',
      customVideo: null,
      previewUrl: null
    },
    {
      id: 3,
      video: '/default3.mp4',
      text: 'Closing Text',
      transition: 'fade',
      customVideo: null,
      previewUrl: null
    }
  ]);

  const [selectedSegment, setSelectedSegment] = useState<{
    id: number;
    video: string;
    text: string;
    transition: string;
    customVideo: Uint8Array | null;
    previewUrl: string | null;
  } | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      segments.forEach(segment => {
        if (segment.previewUrl) URL.revokeObjectURL(segment.previewUrl);
      });
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [segments, previewUrl]);

  useEffect(() => {
    if (isProcessing && progress < 99) {
      const interval = setInterval(() => {
        setProgress(p => Math.min(p + 1, 100));
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isProcessing]);
  
  const handlePreview = async () => {
    if (isProcessing) return; // Prevent multiple processing attempts
  
    setIsProcessing(true);
    setProgress(0);
    setError(null);
    
    try {
      // Validate segments
      if (segments.length === 0) {
        throw new Error('No video segments to process');
      }
  
      // Clean up previous preview URL if it exists
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl('');
      }
  
      // Process the video with progress updates
      const processedUrl: string = await processVideo(
        segments, 
        (progress: number): void => {
          setProgress(Math.round(progress * 100));
        }
      );
  
      // Update the preview URL
      setPreviewUrl(processedUrl);
      
      // Optional: Scroll to preview
      const previewElement = document.querySelector('.preview-container');
      previewElement?.scrollIntoView({ behavior: 'smooth' });
  
    } catch (error) {
      console.error('Video processing error:', error);
      
      // Handle specific error types
      let errorMessage = 'An unexpected error occurred during video processing.';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      // Set error state
      setError(errorMessage);
      
      // Show user-friendly error message
      alert(`Failed to process video: ${errorMessage}`);
      
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const handleTextChange = (id: number, newText: string) => {
    setSegments(segments.map(seg => 
      seg.id === id ? {...seg, text: newText} : seg
    ));
  };

  const handleTransitionChange = (id: number, transition: string) => {
    setSegments(segments.map(seg => 
      seg.id === id ? {...seg, transition} : seg
    ));
  };

  const onDrop = async (acceptedFiles: File[], segmentId: number) => {
    const file = acceptedFiles[0];
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    const previewUrl = URL.createObjectURL(new Blob([uint8Array], { type: file.type }));
    
    setSegments(segments.map(seg => 
      seg.id === segmentId ? {
        ...seg,
        customVideo: uint8Array,
        previewUrl: previewUrl
      } : seg
    ));
    console.log('File dropped:', file);
  };

// Enhanced handleDownload with loading state
const handleDownload = async () => {
  if (!previewUrl || isProcessing) {
    alert('Please process the video first');
    return;
  }

  try {
    const tempLink = document.createElement('a');
    tempLink.style.display = 'none';
    tempLink.href = previewUrl;
    tempLink.download = `video-${Date.now()}.mp4`;
    document.body.appendChild(tempLink);
    tempLink.click();
    
    // Cleanup after reasonable delay
    setTimeout(() => {
      document.body.removeChild(tempLink);
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl('');
    }, 5000); // 5-second safety margin
    
  } catch (error) {
    console.error('Download error:', error);
    alert('Download failed. Please try again.');
  }
};

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Preview Panel */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
          
        <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
          {error ? (
            <div className="w-full h-full flex items-center justify-center text-red-500 p-4">
              <p>Error: {error}</p>
            </div>
          ) : isProcessing ? (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <div className="loading-spinner mb-4"></div>
              <div className="text-gray-600 mb-2">Processing video...</div>
              <div className="w-64 bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-purple-600 h-2.5 rounded-full transition-all duration-300" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="mt-2 text-gray-600">{progress}%</div>
            </div>
          ) : previewUrl ? (
            <video
              controls
              autoPlay
              className="w-full h-full object-cover"
              src={previewUrl}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <Film size={40} />
            </div>
          )}
        </div>

          <button
            onClick={handlePreview}
            className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg w-full"
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Generate Preview'}
          </button>
        </div>

        {/* Editing Controls */}
        <div className="bg-white rounded-xl shadow-sm p-6 h-fit">
          <h2 className="text-lg font-semibold mb-4">Editing Tools</h2>
          {selectedSegment && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Text Overlay</label>
                <input
                  type="text"
                  value={selectedSegment.text}
                  onChange={(e) => handleTextChange(selectedSegment.id, e.target.value)}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Transition</label>
                <select
                  value={selectedSegment.transition}
                  onChange={(e) => handleTransitionChange(selectedSegment.id, e.target.value)}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="fade">Fade</option>
                  <option value="slide">Slide</option>
                  <option value="zoom">Zoom</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Replace Video Segment
                </label>
                <FileUploader 
                  segmentId={selectedSegment.id} 
                  onDrop={onDrop}
                />
              </div>
            </>
          )}
          <button
            onClick={handleDownload}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg w-full flex items-center justify-center gap-2"
          >
            <Download size={18} />
            Export Video
          </button>
        </div>

        {/* Timeline */}
        <div className="lg:col-span-3 bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Timeline</h2>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {segments.map((segment) => (
              <motion.div
                key={segment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex-shrink-0"
              >
                <div
                  onClick={() => setSelectedSegment(segment)}
                  className={`w-48 cursor-pointer p-4 rounded-lg border-2 ${
                    selectedSegment?.id === segment.id 
                      ? 'border-purple-600 bg-purple-50' 
                      : 'border-gray-200'
                  }`}
                >
                  <div className="aspect-video bg-gray-100 rounded-lg mb-2 overflow-hidden">
                    <video
                      className="w-full h-full object-cover"
                      src={segment.previewUrl || segment.video}
                    />
                  </div>
                  <p className="text-sm font-medium truncate">{segment.text}</p>
                  <p className="text-xs text-gray-500">{segment.transition}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const FileUploader = ({ segmentId, onDrop }: { segmentId: number, onDrop: (files: File[], segmentId: number) => void }) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'video/mp4': ['.mp4'],
      'video/quicktime': ['.mov'],
      'video/avi': ['.avi']
    },
    maxFiles: 1,
    onDrop: (files) => onDrop(files, segmentId)
  });

  return (
    <div
      {...getRootProps()}
      className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-purple-600 transition-colors"
    >
      <input {...getInputProps()} />
      <Upload className="mx-auto text-gray-400 mb-2" />
      <p className="text-sm text-gray-600">
        Drag video file here or click to upload
      </p>
      <p className="text-xs text-gray-400 mt-1">
        Supported formats: MP4, MOV, AVI
      </p>
    </div>
  );
};

export default Studio;
// import React from 'react';
// import VideoPlayer from '@/components/VideoPlayer';
// const Studio = () => {
//     return (
//         <div>
//             <VideoPlayer />
//         </div>
//     )
// }
// export default Studio;