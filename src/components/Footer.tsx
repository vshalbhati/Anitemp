import React from 'react';
import { Mail, Phone, MapPin, Github, Twitter, Linkedin, Instagram, Youtube } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const socialLinks = [
    { icon: <Github size={24} />, href: '#', label: 'Github' },
    { icon: <Twitter size={24} />, href: '#', label: 'Twitter' },
    { icon: <Linkedin size={24} />, href: '#', label: 'LinkedIn' },
    { icon: <Instagram size={24} />, href: '#', label: 'Instagram' },
    { icon: <Youtube size={24} />, href: '#', label: 'Youtube' }
  ];

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-gray-300">
      <motion.div 
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={container}
        className="max-w-7xl mx-auto px-4 py-16"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Company Info */}
          <motion.div variants={item} className="space-y-6">
            <motion.h3 
              className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text"
            >
              ANITEMP
            </motion.h3>
            <p className="text-sm leading-relaxed text-gray-400">
              Redefining Social Media Marketing. Create stunning content that captivates your audience.
            </p>
            <motion.div 
              className="flex gap-4"
              variants={container}
            >
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ scale: 1.2, color: '#fff' }}
                  whileTap={{ scale: 0.9 }}
                  className="hover:text-white transition-colors duration-200"
                >
                  {social.icon}
                </motion.a>
              ))}
            </motion.div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={item} className="space-y-6">
            <h3 className="text-xl font-semibold text-white">Quick Links</h3>
            <ul className="space-y-3">
              {['Templates', 'Pricing', 'About Us', 'Contact'].map((link) => (
                <motion.li 
                  key={link}
                  whileHover={{ x: 5 }}
                  className="text-gray-400"
                >
                  <Link href="#" className="hover:text-white transition-colors duration-200">
                    {link}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={item} className="space-y-6">
            <h3 className="text-xl font-semibold text-white">Get in Touch</h3>
            <ul className="space-y-4">
              {[
                { icon: <Mail size={18} />, text: 'hello@anitemp.com' },
                { icon: <Phone size={18} />, text: '+91-8572862193' },
                { icon: <MapPin size={18} />, text: 'Currently we are virtual' }
              ].map((item, index) => (
                <motion.li 
                  key={index}
                  className="flex items-center gap-3 text-gray-400"
                  whileHover={{ x: 5, color: '#fff' }}
                >
                  {item.icon}
                  <span>{item.text}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div variants={item} className="space-y-6">
            <h3 className="text-xl font-semibold text-white">Newsletter</h3>
            <p className="text-sm text-gray-400">Stay updated with our latest features and releases.</p>
            <div className="flex flex-col gap-3">
              <motion.input
                type="email"
                placeholder="Enter your email"
                className="bg-gray-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                whileFocus={{ scale: 1.02 }}
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg px-4 py-3 text-sm font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
              >
                Subscribe
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div 
          variants={item}
          className="mt-16 pt-8 border-t border-gray-800"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <motion.p 
              className="text-sm text-gray-400"
              whileHover={{ color: '#fff' }}
            >
              © {currentYear} Anitemp. All rights reserved.
            </motion.p>
            <div className="flex gap-8">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((text) => (
                <motion.a
                  key={text}
                  href="#"
                  className="text-sm text-gray-400"
                  whileHover={{ color: '#fff', x: 2 }}
                >
                  {text}
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
};

export default Footer;