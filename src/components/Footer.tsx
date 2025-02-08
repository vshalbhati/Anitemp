import React from 'react';
import { Mail, Phone, MapPin, Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-white text-lg font-semibold">ANITEMP</h3>
            <p className="text-sm leading-relaxed">
              Redefining Social Media Marketing. Access thousands of professional video templates and create stunning content in minutes.
            </p>
          </div>
          
          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-white text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              {['About Us', 'Services', 'Contact'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm hover:text-white transition-colors duration-200">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-white text-lg font-semibold">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm">
                <Mail size={16} />
                <span>contact@company.com</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Phone size={16} />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <MapPin size={16} />
                <span>123 Business Ave, Suite 100</span>
              </li>
            </ul>
          </div>
          
          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="text-white text-lg font-semibold">Follow Us</h3>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors duration-200">
                <Github size={20} />
              </a>
              <a href="#" className="hover:text-white transition-colors duration-200">
                <Twitter size={20} />
              </a>
              <a href="#" className="hover:text-white transition-colors duration-200">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm">
              © {currentYear} Company Name. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-sm hover:text-white transition-colors duration-200">
                Privacy Policy
              </a>
              <a href="#" className="text-sm hover:text-white transition-colors duration-200">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;