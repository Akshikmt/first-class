import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, Phone, Mail, MessageCircle, Send, CheckCircle2, AlertCircle } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const sectionRef = useRef(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.contact-item',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({
          type: 'success',
          message: 'Thank you! Your message has been received and our team will get in touch with you shortly.'
        });
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          message: ''
        });
      } else {
        setStatus({
          type: 'error',
          message: data.message || 'Something went wrong. Please try again.'
        });
      }
    } catch (error) {
      console.error('Contact Form Error:', error);
      setStatus({
        type: 'error',
        message: 'Could not connect to the server. Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" ref={sectionRef} className="py-24 px-6 lg:px-12 bg-white relative">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center max-w-2xl mx-auto mb-16 contact-item">
          <div className="flex justify-center items-center gap-2 mb-4">
            <span className="text-secondary font-bold uppercase tracking-wider text-sm">Get In Touch</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-display font-bold mb-6 text-primary">
            Contact <span className="text-gradient">Us</span>
          </h2>
          <p className="text-dark-lighter text-lg">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-light-off rounded-[2rem] p-8 lg:p-12 shadow-sm border border-gray-100 contact-item">
          
          {/* Contact Info & Map */}
          <div className="flex flex-col gap-8">
            <div>
              <h3 className="text-2xl font-bold text-dark mb-6">Institute Details</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-dark text-lg">Address</h4>
                    <p className="text-gray-600 leading-relaxed mt-1">
                      Ker Chowmuhani, Opposite Shiv Kali Mandir,<br/>
                      Krishna Nagar, Agartala,<br/>
                      Tripura – 799001
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center text-secondary-dark flex-shrink-0">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-dark text-lg">Phone</h4>
                    <p className="text-gray-600 leading-relaxed mt-1">
                      +91 87946 42802
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <a href="tel:+918794642802" className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary-dark transition-colors shadow-md">
                    <Phone size={18} /> Call Now
                  </a>
                  <a href="https://wa.me/918794642802" target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-green-500 text-white font-medium hover:bg-green-600 transition-colors shadow-md">
                    <MessageCircle size={18} /> WhatsApp
                  </a>
                </div>
              </div>
            </div>

            <div className="w-full h-64 rounded-2xl overflow-hidden shadow-inner bg-gray-200">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14596.223847596851!2d91.272183!3d23.839886!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3753f41249b5a8eb%3A0x286cf2418e265c19!2sKrishna%20Nagar%2C%20Agartala%2C%20Tripura!5e0!3m2!1sen!2sin!4v1680000000000!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Maps Location"
              ></iframe>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-[2rem] p-8 shadow-lg border border-gray-100">
            <h3 className="text-2xl font-bold text-dark mb-6">Send a Message</h3>
            
            {status.message && (
              <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 border ${
                status.type === 'success' 
                  ? 'bg-green-50 border-green-200 text-green-800' 
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}>
                {status.type === 'success' ? <CheckCircle2 className="flex-shrink-0 text-green-600 mt-0.5" size={20} /> : <AlertCircle className="flex-shrink-0 text-red-600 mt-0.5" size={20} />}
                <p className="text-sm font-medium leading-relaxed">{status.message}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-dark-lighter">First Name</label>
                  <input 
                    type="text" 
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required 
                    className="w-full px-4 py-3 rounded-xl bg-light-off border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" 
                    placeholder="John" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-dark-lighter">Last Name</label>
                  <input 
                    type="text" 
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required 
                    className="w-full px-4 py-3 rounded-xl bg-light-off border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" 
                    placeholder="Doe" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-dark-lighter">Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required 
                  className="w-full px-4 py-3 rounded-xl bg-light-off border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" 
                  placeholder="john@example.com" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-dark-lighter">Phone Number</label>
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required 
                  className="w-full px-4 py-3 rounded-xl bg-light-off border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" 
                  placeholder="+91 XXXXX XXXXX" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-dark-lighter">Message</label>
                <textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required 
                  rows="4" 
                  className="w-full px-4 py-3 rounded-xl bg-light-off border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none" 
                  placeholder="How can we help you?"
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl bg-primary text-white font-bold flex items-center justify-center gap-2 hover:bg-primary-dark transition-all shadow-md shadow-primary/20 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                ) : (
                  <>
                    Send Message <Send size={18} />
                  </>
                )}
              </button>
            </form>
          </div>

        </div>

      </div>
    </section>
  );
};

export default Contact;
