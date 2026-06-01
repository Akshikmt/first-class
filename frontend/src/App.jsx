import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Courses from './components/Courses';
import WhyChooseUs from './components/WhyChooseUs';
import Achievements from './components/Achievements';
import Testimonials from './components/Testimonials';
import Gallery from './components/Gallery';
import Contact from './components/Contact';
import Footer from './components/Footer';
import EnrollmentModal from './components/EnrollmentModal';
import AdminDashboard from './components/AdminDashboard';

function App() {
  const [currentView, setCurrentView] = useState('landing'); // landing | admin
  const [isEnrollOpen, setIsEnrollOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState('');

  const handleEnrollClick = (courseTitle = '') => {
    setSelectedCourse(courseTitle);
    setIsEnrollOpen(true);
  };

  const handleAdminToggle = () => {
    setCurrentView(prev => prev === 'landing' ? 'admin' : 'landing');
  };

  if (currentView === 'admin') {
    return <AdminDashboard onBack={() => setCurrentView('landing')} />;
  }

  return (
    <div className="overflow-x-hidden min-h-screen bg-light">
      <Navbar onEnrollClick={() => handleEnrollClick('')} />
      <main>
        <Hero onEnrollClick={() => handleEnrollClick('')} />
        <About />
        <Courses onEnrollClick={handleEnrollClick} />
        <WhyChooseUs />
        <Achievements />
        <Testimonials />
        <Gallery />
        <Contact />
      </main>
      <Footer onAdminClick={handleAdminToggle} />

      {/* Dynamic Global Enrollment Modal */}
      <EnrollmentModal 
        isOpen={isEnrollOpen} 
        onClose={() => setIsEnrollOpen(false)} 
        initialCourseTitle={selectedCourse}
      />
    </div>
  );
}

export default App;
