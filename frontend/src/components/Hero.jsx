import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ArrowRight, Star, Users, BookOpen, Award } from 'lucide-react';

const Hero = ({ onEnrollClick }) => {
  const heroRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Floating animation for stats cards
      gsap.to('.stat-card', {
        y: -15,
        duration: 2,
        yoyo: true,
        repeat: -1,
        ease: 'power1.inOut',
        stagger: 0.2
      });
      
      // Floating animation for abstract shapes
      gsap.to('.shape', {
        rotation: 360,
        duration: 20,
        repeat: -1,
        ease: 'linear'
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="home" ref={heroRef} className="relative min-h-screen flex items-center pt-24 pb-12 overflow-hidden bg-light-off">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 shape" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 shape" />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        
        {/* Left Content */}
        <div className="flex flex-col gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-2 text-secondary font-bold uppercase tracking-wider text-sm"
          >
            <Star size={14} className="text-secondary" fill="currentColor" />
            <span>Agartala's Premier Coaching Institute</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-5xl lg:text-7xl font-display font-bold leading-tight"
          >
            Building <span className="text-gradient">Bright Futures</span> Through Quality Education
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg text-dark-lighter max-w-lg"
          >
            Expert guidance, proven teaching methods, and personalized attention helping students achieve academic excellence in Tripura.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-wrap items-center gap-4 mt-4"
          >
            <a href="#courses" className="px-8 py-4 rounded-full bg-primary text-white font-semibold flex items-center gap-2 hover:bg-primary-dark transition-all hover:shadow-xl hover:shadow-primary/30 transform hover:-translate-y-1">
              Explore Courses
              <ArrowRight size={20} />
            </a>
            <a href="#contact" className="px-8 py-4 rounded-full bg-white text-primary border-2 border-primary/10 font-semibold hover:border-primary/30 hover:bg-primary/5 transition-all">
              Contact Us
            </a>
          </motion.div>
        </div>

        {/* Right Content / Images & Stats */}
        <div className="relative w-full h-[500px] hidden lg:flex items-center justify-center">
          {/* Main Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="w-full h-full max-h-[460px] rounded-[2rem] overflow-hidden shadow-2xl relative"
          >
            <img 
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80" 
              alt="Students studying" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
          </motion.div>

          {/* Floating Stats Cards */}
          <div className="absolute top-6 left-0 glass p-4 rounded-2xl flex items-center gap-4 stat-card z-20">
            <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center text-secondary">
              <Users size={24} />
            </div>
            <div>
              <p className="font-bold text-xl text-primary">1000+</p>
              <p className="text-xs text-dark-lighter font-medium">Students Guided</p>
            </div>
          </div>

          <div className="absolute bottom-6 left-8 glass p-4 rounded-2xl flex items-center gap-4 stat-card z-20" style={{ animationDelay: '1s' }}>
            <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-accent-dark">
              <Award size={24} />
            </div>
            <div>
              <p className="font-bold text-xl text-primary">Proven</p>
              <p className="text-xs text-dark-lighter font-medium">Academic Results</p>
            </div>
          </div>

          <div className="absolute top-1/2 -translate-y-1/2 -right-4 glass p-4 rounded-2xl flex items-center gap-4 stat-card z-20" style={{ animationDelay: '0.5s' }}>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <BookOpen size={24} />
            </div>
            <div>
              <p className="font-bold text-xl text-primary">Expert</p>
              <p className="text-xs text-dark-lighter font-medium">Faculty Members</p>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default Hero;
