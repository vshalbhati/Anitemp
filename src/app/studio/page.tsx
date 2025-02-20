'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Download, Film, Upload, Workflow, ChevronLeft, ChevronRight, Type, Video, Settings, ArrowRightLeft, Shuffle, MoveRight, AudioWaveform } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { processVideo } from '@/components/videoProcessor';
import { useSearchParams } from 'next/navigation';
import '@/app/globals.css';
interface Template {
  _id: string;
  title: string;
  category: string;
  duration: string;
  downloads: number;
  new: boolean;
  tags: string[];
  texts: {
    duration:number;
    position:{
      x:number;
      y:number;
    },
    content:string;
    startsat:number;
  };
  transitions: string[],
  preview:{
      asset: {
        _ref: string;
        url: string;
      }
  },
  videos: {
    videoFile: {
      asset: {
        _ref: string;
        url: string;
      }
    }
  }[];
}

interface TimelineMarker {
  time: number;
  position: number;
}

interface Segment {
  id: number;
  video: string;
  text: string;
  transition: string;
  customVideo: Uint8Array | null;
  previewUrl: string | null;
}

const Studio = () => {
  const searchParams = useSearchParams();
  const templateData = searchParams.get('data');
  const template = templateData ? JSON.parse(templateData) : null;
  const [segments, setSegments] = useState<Segment[]>(() => 
    Array.from({ length: template.videos.length }, (_, i) => ({
      id: i + 1,
      video: template.videos[i].videoFile.asset.url,
      text: template.texts[i]?.content || '',
      transition: template.transitions[i]?.type || 'fade',
      customVideo: null,
      previewUrl: null
    }))
  );

  const [selectedSegment, setSelectedSegment] = useState<Segment | null>(null);
  const [previewUrl, setPreviewUrl] = useState(template.preview.asset.url);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'text' | 'transition' | 'video' | 'settings'>('text');
  const [totalDuration, setTotalDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (previewUrl) {
      setCurrentTime(0);
      setIsPlaying(false);
      
      const video = videoRef.current;
      if (video) {
        video.currentTime = 0;
        
        // Update total duration when new video is loaded
        video.onloadedmetadata = () => {
          setTotalDuration(video.duration);
        };
      }
    }
  }, [previewUrl]);

  useEffect(() => {
    return () => {
      segments.forEach(segment => {
        if (segment.previewUrl) URL.revokeObjectURL(segment.previewUrl);
      });
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [segments, previewUrl]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let rafId: number;

    const updatePlayhead = () => {
      setCurrentTime(video.currentTime);
      if (isPlaying) {
        rafId = requestAnimationFrame(updatePlayhead);
      }
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [previewUrl]);

  const getTransitionIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'fade':
        return <AudioWaveform size={16} className="text-purple-500" />;
      case 'dissolve':
        return <Shuffle size={16} className="text-purple-500" />;
      case 'slide':
        return <MoveRight size={16} className="text-purple-500" />;
      case 'wipe':
        return <ArrowRightLeft size={16} className="text-purple-500" />;
      default:
        return <AudioWaveform size={16} className="text-purple-500" />;
    }
  };

  const handlePreview = async () => {
    if (isProcessing) return; 
    setIsProcessing(true);
    setProgress(0);
    setError(null);
    try {
      if (segments.length === 0) {
        throw new Error('No video segments to process');
      }
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl('');
      } 
      const processedUrl: string = await processVideo(
        segments, 
        (progress: number): void => {
          setProgress(Math.round(progress));
        }
      );
      setPreviewUrl(processedUrl);

      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        setTotalDuration(video.duration);
      };
      video.src = processedUrl;
      const previewElement = document.querySelector('.preview-container');
      previewElement?.scrollIntoView({ behavior: 'smooth' });
  
    } catch (error) {
      console.error('Video processing error:', error);      
      let errorMessage = 'An unexpected error occurred during video processing.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }  
      setError(errorMessage);
      
      alert(`Failed to process video: ${errorMessage}`);
      
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const handleTextChange = (id: number, newText: string) => {
    setSegments(prevSegments => 
      prevSegments.map(seg => 
        seg.id === id ? { ...seg, text: newText } : seg
      )
    );
    if (selectedSegment?.id === id) {
      setSelectedSegment(prev => prev ? { ...prev, text: newText } : null);
    }
  };

  const handleTransitionChange = (id: number, newTransition: string) => {
    setSegments(prevSegments => 
      prevSegments.map(seg => 
        seg.id === id ? { ...seg, transition: newTransition } : seg
      )
    );
    // Update selected segment if it's the one being edited
    if (selectedSegment?.id === id) {
      setSelectedSegment(prev => prev ? { ...prev, transition: newTransition } : null);
    }
  };

  const handleReorder = (reorderedSegments: Segment[]) => {
    setSegments(reorderedSegments);
  };

  const getTotalDuration = (): Promise<number> => {
    return new Promise((resolve) => {
      let totalDuration = 0;
      let videosProcessed = 0;
  
      template.videos.forEach((videoItem: Template['videos'][0]) => {
        const video = document.createElement('video');
        video.preload = 'metadata';
  
        video.onloadedmetadata = () => {
          totalDuration += video.duration;
          videosProcessed++;
  
          if (videosProcessed === template.videos.length) {
            resolve(Math.round(totalDuration));
          }
        };
  
        video.src = videoItem.videoFile.asset.url;
      });
    });
  };
  useEffect(() => {
    const calculateDuration = async () => {
      try {
        const duration = await getTotalDuration();
        setTotalDuration(duration);
      } catch (error) {
        console.error('Error calculating duration:', error);
      }
    };
  
    calculateDuration();
  }, [template.videos]);

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
      
      setTimeout(() => {
        document.body.removeChild(tempLink);
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl('');
      }, 5000);
      
    } catch (error) {
      console.error('Download error:', error);
      alert('Download failed. Please try again.');
    }
  };

  const generateTimelineMarkers = (duration: number): TimelineMarker[] => {
    const markers: TimelineMarker[] = [];
    for (let i = 0; i <= duration; i++) {
      markers.push({
        time: i,
        position: (i / duration) * 100
      });
    }
    return markers;
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="w-80 bg-white border-r border-gray-200 flex flex-col h-full"
          > 
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('text')}
                className={`flex-1 p-3 text-sm font-medium ${activeTab === 'text' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-600'}`}
              >
                <Type size={18} className="mx-auto mb-1" />
                Text
              </button>
              <button
                onClick={() => setActiveTab('transition')}
                className={`flex-1 p-3 text-sm font-medium ${activeTab === 'transition' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-600'}`}
              >
                <AudioWaveform size={18} className="mx-auto mb-1" />
                Transition
              </button>
              <button
                onClick={() => setActiveTab('video')}
                className={`flex-1 p-3 text-sm font-medium ${activeTab === 'video' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-600'}`}
              >
                <Video size={18} className="mx-auto mb-1" />
                Video
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {selectedSegment ? (
                <>
                  {activeTab === 'text' && (
                    <div className="space-y-4">
                      <textarea
                        value={selectedSegment.text}
                        onChange={(e) => handleTextChange(selectedSegment.id, e.target.value)}
                        className="w-full p-3 border rounded-lg min-h-[100px] focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Enter text overlay..."
                      />
                      {/* <p>text starts at: {selectedSegment.text.startsat}</p> */}
                    </div>
                  )}

                  {activeTab === 'transition' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-2">
                        {['fade', 'dissolve', 'slide', 'wipeleft','wiperight','slideleft','slideright','zoomin','zoomout','circlecrop','circleopen','fadeblack','fadewhite'].map((trans) => (
                          <button
                            key={trans}
                            onClick={() => handleTransitionChange(selectedSegment.id, trans)}
                            className={`p-3 rounded-lg border ${
                              selectedSegment.transition === trans 
                                ? 'bg-purple-50 border-purple-600 text-purple-600' 
                                : 'border-gray-200 hover:border-purple-600'
                            }`}
                          >
                            {trans.charAt(0).toUpperCase() + trans.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'video' && (
                    <FileUploader segmentId={selectedSegment.id} onDrop={onDrop} />
                  )}
                </>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  Select a segment from the timeline to edit
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="flex h-16 justify-right items-center p-4 border-b border-gray-200 bg-white">
          <div className="absolute top-3 right-5 flex gap-2">
            <div className="text-sm text-gray-600 rounded-lg flex items-center shadow-md border-gray-600 px-4 text-center justify-center">
              {Math.floor(totalDuration / 60)}:{(totalDuration % 60).toString().padStart(2, '0')}s
            </div>
            <button
              onClick={handlePreview}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              disabled={isProcessing}
            >
              <Workflow size={18} />
              {isProcessing ? 'Processing...' : 'Generate'}
            </button>
            <button
              onClick={handleDownload}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Download size={18} />
              Export
            </button>
          </div>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`absolute top-4 ${isSidebarOpen ? 'left-70' : 'left-4'} z-10 bg-white rounded-full p-2 shadow-md`}
          >
            {isSidebarOpen ? <ChevronLeft size={20} color='gray'/> : <ChevronRight size={20} color='black'/>}
          </button>
        </div>

        {/* Preview Area */}
        <div className="flex-1 p-4 overflow-hidden">
          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden shadow-lg max-w-4xl mx-auto">
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
                ref={videoRef}
                controls
                autoPlay
                className="w-full h-full object-fit"
                src={previewUrl}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <Film size={40} />
              </div>
            )}
          </div>
        </div>

        {/* Timeline */}
        <div className="h-30 bg-white border-t border-gray-200 p-4">
          {/* Timestamps */}
          <div className="relative h-6 mb-2">
            <div className="absolute inset-0">
              {generateTimelineMarkers(totalDuration).map((marker) => (
                <div
                  key={marker.time}
                  className="absolute transform -translate-x-1/2"
                  style={{ left: `${marker.position}%` }}
                >
                  <div className="h-2 w-px bg-gray-300"></div>
                  <div className="text-xs text-gray-500 mt-1">
                    {formatTime(marker.time)}
                  </div>
                </div>
              ))}
              {/* Playhead Indicator */}
              <motion.div
                className="absolute top-0 bottom-0 w-0.5 bg-purple-600 transform -translate-x-1/2 z-10 playhead"
                animate={{ 
                  left: `${(currentTime / totalDuration) * 100}%` 
                }}
                transition={{ 
                  type: "tween",
                  duration: isPlaying ? 0.1 : 0.2,
                  ease: isPlaying ? "linear" : "easeOut"
                }}
              >
                <motion.div 
                  className="w-4 h-4 rounded-full bg-purple-600 -mt-1 -ml-1.5 playhead-handle"
                  whileHover={{ scale: 1.2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                />
              </motion.div>
            </div>
          </div>
          {/* Video segments */}
          <div className="relative h-20">
            <div className="absolute inset-0 flex items-center">
              {segments.map((segment, index) => (
                <React.Fragment key={segment.id}>
                  <div
                    onClick={() => setSelectedSegment(segment)}
                    className={`flex-1 h-12 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                      selectedSegment?.id === segment.id 
                        ? 'border-purple-600 shadow-lg' 
                        : 'border-purple-200 hover:border-purple-400'
                    }`}
                  >
                    <div className="relative w-full h-full group">
                      <video
                        className="w-full h-full object-cover"
                        src={segment.previewUrl || segment.video}
                        muted
                      />
                    </div>
                  </div>
                  {index < segments.length - 1 && (
                    <div className="flex items-center justify-center w-8 h-24">
                      <div className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-purple-50 transition-colors">
                        {getTransitionIcon(segments[index].transition)}
                      </div>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
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