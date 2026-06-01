import React, { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Book, GraduationCap, Microscope, Calculator, PencilRuler, Compass } from 'lucide-react';
import { cn } from '../utils/cn';

gsap.registerPlugin(ScrollTrigger);

const iconMap = {
  Book: <Book size={32} />,
  GraduationCap: <GraduationCap size={32} />,
  Microscope: <Microscope size={32} />,
  Calculator: <Calculator size={32} />,
  PencilRuler: <PencilRuler size={32} />,
  Compass: <Compass size={32} />
};

const fallbackCourses = [
  {
    id: 'school-tuition',
    title: 'School Tuition',
    desc: 'Comprehensive tutoring for classes VI to X covering all major subjects with a focus on fundamentals.',
    icon: 'PencilRuler',
    color: 'text-blue-500',
    bg: 'bg-blue-50'
  },
  {
    id: 'higher-secondary',
    title: 'Higher Secondary',
    desc: 'Specialized coaching for XI & XII students to excel in board examinations.',
    icon: 'GraduationCap',
    color: 'text-purple-500',
    bg: 'bg-purple-50'
  },
  {
    id: 'science-stream',
    title: 'Science Stream',
    desc: 'In-depth physics, chemistry, and mathematics coaching for aspiring engineers and scientists.',
    icon: 'Microscope',
    color: 'text-cyan-500',
    bg: 'bg-cyan-50'
  },
  {
    id: 'commerce-stream',
    title: 'Commerce Stream',
    desc: 'Expert guidance in Accountancy, Business Studies, and Economics.',
    icon: 'Calculator',
    color: 'text-emerald-500',
    bg: 'bg-emerald-50'
  },
  {
    id: 'competitive-exams',
    title: 'Competitive Exams',
    desc: 'Rigorous preparation for JEE, NEET, and other state/national level entrance exams.',
    icon: 'Book',
    color: 'text-red-500',
    bg: 'bg-red-50'
  },
  {
    id: 'foundation-courses',
    title: 'Foundation Courses',
    desc: 'Early preparation programs designed to build strong analytical and reasoning skills.',
    icon: 'Compass',
    color: 'text-amber-500',
    bg: 'bg-amber-50'
  }
];

const Courses = ({ onEnrollClick }) => {
  const [coursesList, setCoursesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);

  useEffect(() => {
    fetch('/api/courses')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch courses');
        return res.json();
      })
      .then(data => {
        setCoursesList(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching courses from API, falling back to static list:', err);
        setCoursesList(fallbackCourses);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (loading || coursesList.length === 0) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('.course-card',
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [loading, coursesList]);

  return (
    <section id="courses" ref={sectionRef} className="py-24 px-6 lg:px-12 bg-light-off relative">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex justify-center items-center gap-2 mb-4">
            <span className="text-secondary font-bold uppercase tracking-wider text-sm">Our Offerings</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-display font-bold mb-6 text-primary">
            Explore Our <span className="text-gradient">Premium Courses</span>
          </h2>
          <p className="text-dark-lighter text-lg">
            We offer a wide range of meticulously designed courses to cater to the diverse academic needs of students at different educational stages.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coursesList.map((course, idx) => (
              <div 
                key={course.id || idx} 
                className="course-card bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-2xl hover:border-transparent transition-all duration-300 group cursor-pointer relative flex flex-col overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                
                <div className={cn("w-16 h-16 rounded-xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110", course.bg || 'bg-blue-50', course.color || 'text-blue-500')}>
                  {iconMap[course.icon] || <Book size={32} />}
                </div>
                
                <h3 className="text-2xl font-bold text-dark mb-4 group-hover:text-primary transition-colors">{course.title}</h3>
                <p className="text-gray-600 mb-8 leading-relaxed flex-grow">
                  {course.desc}
                </p>
                
                <div className="flex justify-between items-center mt-auto pt-6 border-t border-gray-100">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onEnrollClick) onEnrollClick(course.title);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-all transform hover:-translate-y-0.5 shadow-sm shadow-primary/10 hover:shadow-lg hover:shadow-primary/20"
                  >
                    Enroll Now
                  </button>
                  <div className="flex items-center text-sm font-semibold text-primary">
                    <span className="relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-primary group-hover:after:w-full after:transition-all after:duration-300">
                      Learn More
                    </span>
                    <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

export default Courses;
