'use client';

import React, { useState, useEffect } from 'react';
import { Play, Clock, Download, Filter, Search, X, Edit, Save } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {client} from '@/lib/sanity'

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 }
};

const modalVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 50, scale: 0.95 }
};

interface Template {
  _id: string;
  title: string;
  category: string;
  duration: string;
  downloads: number;
  new: boolean;
  tags: string[];
  texts: string[];
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

const TemplatesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [templates, setTemplates] = useState<Template[]>([]);

  useEffect(() => {
    setIsVisible(true);
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    const data = await client.fetch<Template[]>(`*[_type == "template"]{
      _id,
      title,
      category,
      duration,
      downloads,
      new,
      preview{
        asset->{
          _ref,
          url
        }
      },
      texts[],
      transitions[],
      tags,
      videos[] {
        videoFile {
          asset-> {
            _ref,
            url
          }
        }
      }
    }`)
    setTemplates(data)
  }
  const openPreview = (template: Template) => {
    setSelectedTemplate(template);
    setIsModalOpen(true);
  };

  const closePreview = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedTemplate(null), 300); 
  };

  const categories = [
    { id: 'all', name: 'All Templates' },
    { id: 'stories', name: 'Instagram Stories' },
    { id: 'reels', name: 'Reels & TikTok' },
    { id: 'posts', name: 'Social Posts' },
    { id: 'ads', name: 'Video Ads' }
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className={`space-y-4 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} transition-all duration-1000`}>
            <h1 className="text-4xl font-bold">Video Templates</h1>
            <p className="text-xl text-purple-100">Choose from our collection of professional templates</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-8">
        <div className={`bg-white rounded-xl shadow-lg p-6 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} transition-all duration-1000 delay-200`}>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search templates..."
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTemplates.map((template: Template, index) => (
            <div
              key={template._id}
              className={`group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all transform ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="aspect-video bg-gray-100 relative">
                <img
                  src={`/api/placeholder/600/338`}
                  alt={template.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                <button 
                  onClick={() => openPreview(template)}
                  className="opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0 bg-white text-purple-600 px-6 py-3 rounded-lg font-medium flex items-center gap-2"
                >
                  Preview Template <Play className="w-4 h-4" />
                </button>
                </div>
                {template.new && (
                  <div className="absolute top-4 left-4 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    New
                  </div>
                )}
              </div>

              <div className="p-6">
                <h3 className="text-lg font-semibold mb-2">{template.title}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {template.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <Download className="w-4 h-4" />
                    {template.downloads.toLocaleString()}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {template.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={overlayVariants}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden"
              variants={modalVariants}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            >
              <div className="flex justify-between items-center p-4 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800">
                  {selectedTemplate?.title}
                </h2>
                <button
                  onClick={closePreview}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="aspect-video bg-gray-900 relative">
                <video 
                  autoPlay 
                  muted 
                  loop
                  className="w-full h-full object-cover"
                >
                  <source src={selectedTemplate?.preview?.asset?.url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>

              <div className="p-6 flex flex-col sm:flex-row gap-4 justify-end">
                <Link
                  href={{
                    pathname: `/studio`,
                    query: { data: JSON.stringify(selectedTemplate) }
                  }}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center gap-2 justify-center"
                >
                  <Edit className="w-5 h-5" />
                  Edit Template
                </Link>
                <button
                  onClick={closePreview}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center gap-2 justify-center"
                >
                  <Save className="w-5 h-5" />
                  Save to Collection
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TemplatesPage;