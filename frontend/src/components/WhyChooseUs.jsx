import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CheckCircle } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const features = [
  "Experienced Faculty",
  "Small Batch Sizes",
  "Individual Attention",
  "Regular Assessments",
  "Doubt Solving Sessions",
  "Result-Oriented Teaching",
  "Modern Teaching Methods",
  "Parent Progress Updates"
];

const WhyChooseUs = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.feature-item',
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 px-6 lg:px-12 bg-primary relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-12 h-[2px] bg-secondary"></div>
            <span className="text-secondary font-bold uppercase tracking-wider text-sm">Why Choose Us</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-display font-bold mb-6 text-white">
            The <span className="text-secondary">Gold Standard</span> in Education
          </h2>
          <p className="text-white/80 text-lg mb-8 leading-relaxed">
            We don't just teach; we mentor. Our holistic approach ensures that every student gets the attention and resources they need to succeed academically and personally.
          </p>
          
          <button className="px-8 py-4 rounded-full bg-secondary text-dark font-semibold hover:bg-white transition-all transform hover:-translate-y-1 hover:shadow-lg">
            Join Our Institute
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((feature, idx) => (
            <div 
              key={idx} 
              className="feature-item glass p-4 rounded-xl flex items-center gap-3 border border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 transition-colors"
            >
              <CheckCircle className="text-secondary flex-shrink-0" size={24} />
              <span className="text-white font-medium">{feature}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default WhyChooseUs;
