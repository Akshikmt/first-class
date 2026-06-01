import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Target, Lightbulb, Heart, CheckCircle2 } from 'lucide-react';
import { cn } from '../utils/cn';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Reveal animations for content
      gsap.fromTo('.about-content > *', 
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8, 
          stagger: 0.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          }
        }
      );

      // Reveal animation for image
      gsap.fromTo('.about-image',
        { opacity: 0, x: 50 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
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

  const features = [
    { icon: <Target className="text-secondary" />, title: 'Goal Oriented', desc: 'Focus on clear academic objectives' },
    { icon: <Lightbulb className="text-accent-dark" />, title: 'Conceptual Learning', desc: 'Understanding over memorization' },
    { icon: <Heart className="text-red-400" />, title: 'Student First', desc: 'Personalized attention for every student' },
  ];

  return (
    <section id="about" ref={sectionRef} className="py-24 px-6 lg:px-12 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Left Content */}
        <div className="about-content">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-12 h-[2px] bg-secondary"></div>
            <span className="text-secondary font-bold uppercase tracking-wider text-sm">About Us</span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-display font-bold mb-6">
            Nurturing Minds for a <span className="text-gradient">Brighter Tomorrow</span>
          </h2>
          
          <p className="text-dark-lighter text-lg mb-8 leading-relaxed">
            At Chakraborty's First Classes, we believe that every student has the potential to excel. 
            Our mission is to unlock that potential through a blend of traditional values and modern teaching methodologies. 
            We are committed to providing an environment where learning is not just about passing exams, but about understanding the world.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
            {features.map((feat, idx) => (
              <div key={idx} className="flex flex-col gap-3">
                <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100">
                  {feat.icon}
                </div>
                <h4 className="font-bold text-dark">{feat.title}</h4>
                <p className="text-sm text-gray-500 leading-tight">{feat.desc}</p>
              </div>
            ))}
          </div>
          
          <ul className="space-y-3">
            {['Experienced and dedicated faculty', 'Comprehensive study materials', 'Regular performance tracking', 'Interactive learning sessions'].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-dark-lighter font-medium">
                <CheckCircle2 size={20} className="text-primary flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Right Image */}
        <div className="about-image relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-[2rem] transform translate-x-6 translate-y-6"></div>
          <div className="relative rounded-[2rem] overflow-hidden shadow-2xl aspect-[4/5] lg:aspect-square">
            <img 
              src="https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80" 
              alt="Teacher interacting with students" 
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Floating Element */}
          <div className="absolute -left-8 top-1/4 glass p-6 rounded-2xl hidden md:block">
            <p className="font-display font-bold text-4xl text-primary mb-1">15+</p>
            <p className="text-sm text-dark-lighter font-medium uppercase tracking-wider">Years of<br/>Experience</p>
          </div>
        </div>
        
      </div>
    </section>
  );
};

export default About;
