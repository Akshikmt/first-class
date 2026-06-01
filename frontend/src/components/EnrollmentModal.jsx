import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle2, AlertCircle } from 'lucide-react';

const EnrollmentModal = ({ isOpen, onClose, initialCourseTitle }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    courseTitle: '',
    message: ''
  });
  const [courses, setCourses] = useState([]);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialCourseTitle) {
      setFormData(prev => ({ ...prev, courseTitle: initialCourseTitle }));
    }
  }, [initialCourseTitle]);

  useEffect(() => {
    // Fetch courses list for dropdown
    fetch('/api/courses')
      .then(res => res.json())
      .then(data => setCourses(data))
      .catch(err => console.error('Error fetching courses list:', err));
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
      const response = await fetch('/api/enroll', {
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
          message: 'Success! Your enrollment application has been submitted. Our admissions team will contact you shortly.'
        });
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          courseTitle: initialCourseTitle || '',
          message: ''
        });
        setTimeout(() => {
          onClose();
          setStatus({ type: '', message: '' });
        }, 3000);
      } else {
        setStatus({
          type: 'error',
          message: data.message || 'Submission failed. Please try again.'
        });
      }
    } catch (error) {
      console.error('Enrollment Submission Error:', error);
      setStatus({
        type: 'error',
        message: 'Could not connect to the server. Please check your connection.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-dark/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="relative bg-white w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100 z-10 max-h-[90vh] flex flex-col"
          >
            {/* Header decoration */}
            <div className="h-2 bg-gradient-to-r from-primary via-secondary to-accent" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full bg-light-off text-dark hover:bg-red-50 hover:text-red-500 transition-colors z-20"
            >
              <X size={20} />
            </button>

            {/* Content Scrollable */}
            <div className="p-8 overflow-y-auto">
              <div className="mb-6">
                <span className="text-secondary font-bold text-xs uppercase tracking-widest">Enrollment Application</span>
                <h3 className="text-3xl font-display font-bold text-primary mt-1">Join Our Academy</h3>
                <p className="text-dark-lighter text-sm mt-2">
                  Complete this form to request enrollment and secure your seat in our expert coaching classes.
                </p>
              </div>

              {status.message && (
                <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 border ${
                  status.type === 'success'
                    ? 'bg-green-50 border-green-200 text-green-800'
                    : 'bg-red-50 border-red-200 text-red-800'
                }`}>
                  {status.type === 'success' ? <CheckCircle2 className="flex-shrink-0 text-green-600 mt-0.5" size={20} /> : <AlertCircle className="flex-shrink-0 text-red-600 mt-0.5" size={20} />}
                  <p className="text-xs font-semibold leading-relaxed">{status.message}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-dark-lighter">First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 rounded-xl bg-light-off border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm transition-all"
                      placeholder="John"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-dark-lighter">Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 rounded-xl bg-light-off border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm transition-all"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-dark-lighter">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-light-off border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm transition-all"
                    placeholder="john@example.com"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-dark-lighter">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-light-off border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm transition-all"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-dark-lighter">Select Course *</label>
                  <select
                    name="courseTitle"
                    value={formData.courseTitle}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-light-off border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm transition-all appearance-none cursor-pointer"
                  >
                    <option value="" disabled>-- Select a Course --</option>
                    {courses.length > 0 ? (
                      courses.map(c => (
                        <option key={c.id} value={c.title}>{c.title}</option>
                      ))
                    ) : (
                      <>
                        <option value="School Tuition">School Tuition (VI-X)</option>
                        <option value="Higher Secondary">Higher Secondary (XI-XII)</option>
                        <option value="Science Stream">Science Stream</option>
                        <option value="Commerce Stream">Commerce Stream</option>
                        <option value="Competitive Exams">Competitive Exams</option>
                        <option value="Foundation Courses">Foundation Courses</option>
                      </>
                    )}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-dark-lighter">Additional Notes (Optional)</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-2.5 rounded-xl bg-light-off border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm transition-all resize-none"
                    placeholder="Tell us about your learning goals..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-primary text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary-dark transition-all shadow-md shadow-primary/20 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mt-2"
                >
                  {isSubmitting ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  ) : (
                    <>
                      Submit Application <Send size={16} />
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default EnrollmentModal;
