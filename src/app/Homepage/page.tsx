'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Play, Star, Users, ArrowRight, ChevronRight } from 'lucide-react';
import GridDistortion from '../../components/GridDistortion';
const HomePage = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const featuredTemplates = [
    {
      id: 1,
      title: "Dynamic Story Slideshow",
      category: "Instagram Stories",
      downloads: "2.3k",
      rating: 4.8,
    },
    {
      id: 2,
      title: "Trendy Reel Template",
      category: "Reels",
      downloads: "1.8k",
      rating: 4.9,
    },
    {
      id: 3,
      title: "Product Showcase",
      category: "Posts",
      downloads: "3.1k",
      rating: 4.7,
    }
  ];

  return (
    <div className="min-h-screen">
       <div style={{ width: '100%', height: '1200px', position: 'relative' }}>
        {/* <GridDistortion
          imageSrc="https://picsum.photos/1920/1080?grayscale"
          grid={10}
          mouse={0.1}
          strength={0.15}
          relaxation={0.9}
          className="custom-class"
        /> */}
        <h1 className='text-9xl absolute font-extrabold text-center 
                      top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                      mix-blend-difference text-white z-10 '>
          ANITEMP
        </h1>
        <h1 className="text-3xl absolute font-bold text-center 
                      top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                      mix-blend-difference text-white z-10 ">
          Redifining Creative Video Templates
        </h1>
        <div className="absolute bottom-0 w-full z-20 backdrop-blur-lg backdrop-filter bg-black/30 border-t border-white/10 shadow-2xl">
          <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16 lg:py-20">
            <div className={`space-y-8 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} transition-all duration-1000`}>
              <h1 className="text-4xl md:text-6xl font-bold max-w-4xl text-white">
                Create Stunning Social Media Content in Minutes
              </h1>
              <p className="text-xl md:text-2xl text-grey-200/90 max-w-2xl">
                Professional video templates for Instagram, TikTok, and more. No design skills needed.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  href="/templates"
                  className="bg-gray-800/90 backdrop-blur-lg backdrop-filter text-white-600 px-8 py-4 rounded-xl font-semibold hover:bg-white-600/90 transition-all flex items-center gap-2 shadow-lg hover:shadow-xl"
                >
                  Browse Templates <ArrowRight className="w-5 h-5" />
                </Link>
                <Link 
                  href="/demo"
                  className="bg-white-600/90 backdrop-blur-lg backdrop-filter text-black px-8 py-4 rounded-xl font-semibold hover:bg-white-600 transition-all flex items-center gap-2 shadow-lg hover:shadow-xl backdrop-blur-sm"
                >
                  Watch Demo <Play className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Play className="w-8 h-8 text-blue-500" />,
                title: "Ready-to-Use Templates",
                description: "100+ professionally designed templates for every occasion"
              },
              {
                icon: <Users className="w-8 h-8 text-blue-500" />,
                title: "Easy Customization",
                description: "Modify text, colors, and media with simple clicks"
              },
              {
                icon: <Star className="w-8 h-8 text-blue-500" />,
                title: "Premium Quality",
                description: "High-resolution exports optimized for each platform"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className={`p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                {feature.icon}
                <h3 className="text-xl font-semibold mt-4 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Templates</h2>
            <p className="text-gray-600">Start with our most popular templates</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {featuredTemplates.map((template, index) => (
              <div 
                key={template.id}
                className={`group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="aspect-video bg-gray-100 relative">
                  <img 
                    src={`/api/placeholder/400/225`}
                    alt={template.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                    <button className="opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0 bg-white text-blue-600 px-4 py-2 rounded-lg font-medium flex items-center gap-2">
                      Preview <Play className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="text-sm text-blue-600 mb-2">{template.category}</div>
                  <h3 className="text-lg font-semibold mb-2">{template.title}</h3>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      {template.rating}
                    </div>
                    <div>{template.downloads} downloads</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link 
              href="/templates"
              className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:gap-3 transition-all"
            >
              View All Templates <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Create Amazing Content?
          </h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Join thousands of creators who trust our templates for their social media content.
          </p>
          <Link 
            href="/templates"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-500 transition-colors"
          >
            Get Started Now <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;