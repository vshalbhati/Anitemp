'use client';
import "./globals.css";


import React, { useState } from 'react';
import LoadingScreen from '@/components/LoadingScreen';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <html lang="en">
      <body>
        {isLoading && <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />}
        <div className={`transition-opacity duration-1000 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
          {/* <Navigation /> */}
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}