import React from 'react';
import { BookOpen } from 'lucide-react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = ({ onAdminClick }) => {
  return (
    <footer className="bg-primary-dark pt-20 pb-10 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand */}
          <div className="flex flex-col gap-6">
            <a href="#home" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary">
                <BookOpen size={24} />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-lg leading-tight text-white">Chakraborty's</span>
                <span className="font-sans text-xs tracking-widest text-secondary font-semibold uppercase">First Classes</span>
              </div>
            </a>
            <p className="text-white/70 leading-relaxed">
              Empowering students with knowledge, skills, and confidence to achieve academic excellence and beyond.
            </p>
            <div className="flex gap-4">
              {[FaFacebook, FaTwitter, FaInstagram, FaLinkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-secondary hover:text-dark transition-all">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 relative inline-block after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-12 after:h-1 after:bg-secondary">Quick Links</h4>
            <ul className="space-y-4">
              {['Home', 'About Us', 'Courses', 'Achievements', 'Gallery', 'Contact'].map((link, i) => (
                <li key={i}>
                  <a href={`#${link.toLowerCase().replace(' ', '')}`} className="text-white/70 hover:text-secondary transition-colors inline-flex items-center gap-2 before:content-['›'] before:text-secondary">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Courses */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 relative inline-block after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-12 after:h-1 after:bg-secondary">Our Courses</h4>
            <ul className="space-y-4">
              {['School Tuition (VI-X)', 'Higher Secondary (XI-XII)', 'Science Stream', 'Commerce Stream', 'Competitive Exams', 'Foundation Courses'].map((link, i) => (
                <li key={i}>
                  <a href="#courses" className="text-white/70 hover:text-secondary transition-colors inline-flex items-center gap-2 before:content-['›'] before:text-secondary">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 relative inline-block after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-12 after:h-1 after:bg-secondary">Newsletter</h4>
            <p className="text-white/70 mb-4">
              Subscribe to our newsletter to get latest updates and news.
            </p>
            <form className="flex gap-2">
              <input 
                type="email" 
                placeholder="Email Address" 
                className="w-full px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-secondary transition-colors"
              />
              <button className="px-4 py-2.5 rounded-lg bg-secondary text-dark font-bold hover:bg-white transition-colors">
                Subscribe
              </button>
            </form>
          </div>

        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-white/50 text-sm">
          <p>&copy; {new Date().getFullYear()} Chakraborty's First Classes. All rights reserved.</p>
          <div className="flex gap-6 items-center">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <button 
              onClick={onAdminClick}
              className="hover:text-white hover:underline transition-colors font-medium text-left cursor-pointer border-none bg-transparent"
            >
              Admin Portal
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
