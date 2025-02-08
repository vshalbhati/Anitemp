'use client';

import React, { useState, useEffect } from 'react';

const LoadingScreen = ({ onLoadingComplete }: { onLoadingComplete: () => void }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Start fade out after video ends (adjust timeout as needed)
    const timer = setTimeout(() => {
      setIsVisible(false);
      // Call onLoadingComplete after fade animation
      setTimeout(onLoadingComplete, 1000);
    }, 3000); // Adjust this to match your video duration

    return () => clearTimeout(timer);
  }, [onLoadingComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 bg-black transition-opacity duration-1000 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <video
        autoPlay
        muted
        playsInline
        className="w-full h-full object-cover"
      >
        <source src="/loading-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default LoadingScreen;