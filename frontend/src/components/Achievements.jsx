import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: 1000, label: "Students Enrolled", suffix: "+" },
  { value: 95, label: "Success Stories", suffix: "%" },
  { value: 15, label: "Courses Offered", suffix: "+" },
  { value: 20, label: "Years of Excellence", suffix: "+" },
];

const Achievements = () => {
  const sectionRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 80%',
        onEnter: () => {
          if (!hasAnimated) {
            setHasAnimated(true);
            
            // Animate counters
            gsap.to('.counter-value', {
              innerHTML: (i, target) => {
                const endValue = parseInt(target.getAttribute('data-target'));
                return endValue;
              },
              duration: 2.5,
              snap: { innerHTML: 1 },
              ease: 'power1.out',
              stagger: 0.1,
            });
          }
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [hasAnimated]);

  return (
    <section ref={sectionRef} className="py-20 px-6 lg:px-12 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-gray-100">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center justify-center text-center p-4">
              <div className="flex items-baseline gap-1 mb-2">
                <span 
                  className="counter-value text-4xl lg:text-5xl font-display font-bold text-primary"
                  data-target={stat.value}
                >
                  0
                </span>
                <span className="text-3xl font-display font-bold text-secondary">{stat.suffix}</span>
              </div>
              <span className="text-sm lg:text-base text-dark-lighter font-medium uppercase tracking-wide">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Achievements;
