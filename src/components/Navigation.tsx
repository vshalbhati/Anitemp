import React, { useState, useEffect, useCallback} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, User, Sparkles } from 'lucide-react';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  const handleScroll = useCallback(() => {
    if (isMobile && isOpen) return; // Prevent scroll state changes when menu is open
    setIsScrolled(window.scrollY > 50);
  }, [isMobile, isOpen]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Close menu when scrolling on mobile
  useEffect(() => {
    if (isMobile && isOpen) {
      const handleMobileScroll = () => setIsOpen(false);
      window.addEventListener('scroll', handleMobileScroll);
      return () => window.removeEventListener('scroll', handleMobileScroll);
    }
  }, [isMobile, isOpen]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const isActive = (path: string) => pathname === path;

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/templates', label: 'Templates' },
    { 
      href: '#',
      label: 'Categories',
      children: [
        { href: '/templates/instagram-stories', label: 'Instagram Stories', icon: '🟣' },
        { href: '/templates/reels', label: 'Reels', icon: '🎥' },
        { href: '/templates/posts', label: 'Posts', icon: '🖼️' }
      ]
    },
  ];

  return (
    <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${isScrolled ? 'backdrop-blur-md bg-white/90 shadow-sm' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center space-x-2 group">
            <Sparkles className="h-6 w-6 text-white-600 group-hover:rotate-12 transition-transform" />
            <span className="text-2xl font-bold mix-blend-difference text-white">
              Anitemp
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <div key={link.href} className="relative group">
                {link.children ? (
                  <div className="relative">
                    <button className="flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-gray-100/50 transition-all">
                      <span className="mix-blend-difference text-white">{link.label}</span>
                      <ChevronDown className="h-4 w-4 mix-blend-difference transition-transform group-hover:rotate-180" />
                    </button>
                    
                    <div className="absolute top-full left-0 pt-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                      <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-2 min-w-[220px] border border-gray-100">
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <span className="text-lg">{child.icon}</span>
                            <span className="text-gray-700">{child.label}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    href={link.href}
                    className={`relative px-3 py-2 rounded-lg transition-all ${
                      isActive(link.href)
                        ? 'mix-blend-difference text-white font-medium'
                        : 'mix-blend-difference text-white hover:text-blue-600'
                    }`}
                  >
                    {link.label}
                    {isActive(link.href) && (
                      <span className="absolute bottom-0 left-1/2 w-4 h-1 bg-blue-600 rounded-full -translate-x-1/2" />
                    )}
                  </Link>
                )}
              </div>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/auth/login"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/auth/startup"
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
            >
              Get Started
            </Link>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            onTouchStart={(e) => e.preventDefault()}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100/50 transition-colors touch-none"
          >
            {isOpen ? (
              <X className="h-6 w-6 text-gray-700" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>
      </div>

      <div className={`md:hidden fixed inset-0 bg-white/95 backdrop-blur-lg transition-transform duration-300 ease-out ${isOpen ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="pt-20 px-6 space-y-8">
          <button 
            onClick={() => setIsOpen(false)}
            className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="h-6 w-6 text-gray-700" />
          </button>

          {navLinks.map((link) => (
            <div key={link.href} className="border-b border-gray-100 pb-6 last:border-0">
              {link.children ? (
                <div className="space-y-4">
                  <div className="text-lg font-medium text-gray-900">{link.label}</div>
                  <div className="space-y-3 pl-4">
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 py-2 transition-colors"
                      >
                        <span className="text-lg">{child.icon}</span>
                        <span>{child.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block text-lg font-medium py-2 ${
                    isActive(link.href)
                      ? 'text-blue-600'
                      : 'text-gray-900 hover:text-blue-600'
                  }`}
                >
                  {link.label}
                </Link>
              )}
            </div>
          ))}

          <div className="pt-8 space-y-4">
            <Link
              href="/auth/login"
              onClick={() => setIsOpen(false)}
              className="block w-full px-6 py-3 text-center font-medium bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/auth/startup"
              onClick={() => setIsOpen(false)}
              className="block w-full px-6 py-3 text-center font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-full hover:shadow-lg transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
export default Navigation;
