import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../utils/cn';

const testimonials = [
  {
    text: "Joining Chakraborty's First Classes was the best decision for my board exams. The faculty's dedication is unmatched.",
    author: "Rahul S.",
    role: "Class XII Student",
    image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"
  },
  {
    text: "The personalized attention my daughter received helped her overcome her fear of Mathematics. Highly recommended!",
    author: "Mrs. Sharma",
    role: "Parent",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"
  },
  {
    text: "Their competitive exam foundation course laid a strong base for my JEE preparation. The study materials are excellent.",
    author: "Amit K.",
    role: "Engineering Aspirant",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"
  }
];

const Testimonials = () => {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="py-24 px-6 lg:px-12 bg-light relative overflow-hidden">
      
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-4xl mx-auto relative z-10 text-center">
        
        <div className="flex justify-center items-center gap-2 mb-4">
          <span className="text-secondary font-bold uppercase tracking-wider text-sm">Testimonials</span>
        </div>
        <h2 className="text-4xl lg:text-5xl font-display font-bold mb-16 text-primary">
          What Our <span className="text-gradient">Students & Parents</span> Say
        </h2>

        <div className="relative glass p-8 md:p-12 rounded-[2rem]">
          <Quote className="absolute top-6 left-6 text-primary/10 w-16 h-16 rotate-180" />
          
          <div className="min-h-[250px] flex items-center justify-center">
            <AnimatePresence mode='wait'>
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center"
              >
                <p className="text-xl md:text-2xl text-dark-lighter font-medium italic mb-8 leading-relaxed">
                  "{testimonials[current].text}"
                </p>
                
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-secondary shadow-md">
                    <img src={testimonials[current].image} alt={testimonials[current].author} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold text-dark text-lg">{testimonials[current].author}</h4>
                    <p className="text-sm text-gray-500">{testimonials[current].role}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button 
              onClick={prev}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-gray-100 shadow-sm text-primary hover:bg-primary hover:text-white transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, idx) => (
                <button 
                  key={idx}
                  onClick={() => setCurrent(idx)}
                  className={cn(
                    "w-2.5 h-2.5 rounded-full transition-all duration-300",
                    idx === current ? "bg-primary w-6" : "bg-gray-300"
                  )}
                />
              ))}
            </div>
            <button 
              onClick={next}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-gray-100 shadow-sm text-primary hover:bg-primary hover:text-white transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};

export default Testimonials;
