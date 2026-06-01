import React, { useState, useEffect } from 'react';
import { 
  Users, MessageSquare, BookOpen, GraduationCap, CheckCircle, 
  Clock, ArrowLeft, Trash2, Edit3, Plus, Search, Check, X,
  AlertCircle, PencilRuler, Microscope, Calculator, Compass, Book
} from 'lucide-react';
import { cn } from '../utils/cn';

const iconOptions = ['Book', 'GraduationCap', 'Microscope', 'Calculator', 'PencilRuler', 'Compass'];
const colorOptions = [
  { label: 'Blue', value: 'text-blue-500', bg: 'bg-blue-50' },
  { label: 'Purple', value: 'text-purple-500', bg: 'bg-purple-50' },
  { label: 'Cyan', value: 'text-cyan-500', bg: 'bg-cyan-50' },
  { label: 'Emerald', value: 'text-emerald-500', bg: 'bg-emerald-50' },
  { label: 'Red', value: 'text-red-500', bg: 'bg-red-50' },
  { label: 'Amber', value: 'text-amber-500', bg: 'bg-amber-50' }
];

const AdminDashboard = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search Filters
  const [searchQuery, setSearchQuery] = useState('');

  // Course Form State
  const [courseForm, setCourseForm] = useState({
    id: '', // Empty means creating new
    title: '',
    desc: '',
    icon: 'Book',
    color: 'text-blue-500',
    bg: 'bg-blue-50'
  });
  const [isEditingCourse, setIsEditingCourse] = useState(false);
  const [courseError, setCourseError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, enrollRes, inqRes, coursesRes] = await Promise.all([
        fetch('/api/admin/stats').then(res => res.json()),
        fetch('/api/admin/enrollments').then(res => res.json()),
        fetch('/api/admin/contacts').then(res => res.json()),
        fetch('/api/courses').then(res => res.json())
      ]);

      setStats(statsRes);
      setEnrollments(enrollRes);
      setInquiries(inqRes);
      setCourses(coursesRes);
    } catch (error) {
      console.error('Error fetching admin dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await fetch(`/api/admin/enrollments/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        // Refresh local data
        setEnrollments(prev => prev.map(e => e.id === id ? { ...e, status: newStatus } : e));
        // Refresh stats
        fetch('/api/admin/stats')
          .then(res => res.json())
          .then(data => setStats(data));
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDeleteEnrollment = async (id) => {
    if (!confirm('Are you sure you want to delete this enrollment?')) return;
    try {
      const response = await fetch(`/api/admin/enrollments/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setEnrollments(prev => prev.filter(e => e.id !== id));
        fetchData();
      }
    } catch (error) {
      console.error('Error deleting enrollment:', error);
    }
  };

  const handleDeleteInquiry = async (id) => {
    if (!confirm('Are you sure you want to delete this inquiry?')) return;
    try {
      const response = await fetch(`/api/admin/contacts/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setInquiries(prev => prev.filter(i => i.id !== id));
        fetchData();
      }
    } catch (error) {
      console.error('Error deleting inquiry:', error);
    }
  };

  // Course Add / Edit CRUD
  const handleOpenAddCourse = () => {
    setCourseForm({
      id: '',
      title: '',
      desc: '',
      icon: 'Book',
      color: 'text-blue-500',
      bg: 'bg-blue-50'
    });
    setIsEditingCourse(true);
    setCourseError('');
  };

  const handleOpenEditCourse = (course) => {
    setCourseForm({
      id: course.id,
      title: course.title,
      desc: course.desc,
      icon: course.icon,
      color: course.color,
      bg: course.bg
    });
    setIsEditingCourse(true);
    setCourseError('');
  };

  const handleCourseColorChange = (colorValue) => {
    const matched = colorOptions.find(o => o.value === colorValue);
    setCourseForm(prev => ({
      ...prev,
      color: colorValue,
      bg: matched ? matched.bg : 'bg-blue-50'
    }));
  };

  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    setCourseError('');

    const url = courseForm.id 
      ? `/api/admin/courses/${courseForm.id}` 
      : '/api/admin/courses';
    const method = courseForm.id ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: courseForm.title,
          desc: courseForm.desc,
          icon: courseForm.icon,
          color: courseForm.color,
          bg: courseForm.bg
        })
      });
      const data = await response.json();

      if (response.ok) {
        setIsEditingCourse(false);
        fetchData();
      } else {
        setCourseError(data.message || 'Course saving failed.');
      }
    } catch (error) {
      setCourseError('Could not connect to backend server.');
    }
  };

  const handleDeleteCourse = async (id) => {
    if (!confirm('Are you sure you want to delete this course? Doing so will remove it from the course offerings on the home page.')) return;
    try {
      const response = await fetch(`/api/admin/courses/${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  // Rendering Helpers
  const renderIcon = (iconName, colorClass, bgClass) => {
    const props = { size: 24, className: colorClass };
    const elements = {
      Book: <Book {...props} />,
      GraduationCap: <GraduationCap {...props} />,
      Microscope: <Microscope {...props} />,
      Calculator: <Calculator {...props} />,
      PencilRuler: <PencilRuler {...props} />,
      Compass: <Compass {...props} />
    };
    return (
      <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", bgClass || 'bg-blue-50')}>
        {elements[iconName] || <Book {...props} />}
      </div>
    );
  };

  // Filters
  const filteredEnrollments = enrollments.filter(e => {
    const fullText = `${e.firstName} ${e.lastName} ${e.email} ${e.phone} ${e.courseTitle} ${e.status}`.toLowerCase();
    return fullText.includes(searchQuery.toLowerCase());
  });

  const filteredInquiries = inquiries.filter(i => {
    const fullText = `${i.firstName} ${i.lastName} ${i.email} ${i.phone} ${i.message}`.toLowerCase();
    return fullText.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col font-sans selection:bg-secondary selection:text-dark">
      {/* Top Navbar */}
      <header className="border-b border-slate-800 bg-[#0F172A]/80 backdrop-blur-md sticky top-0 z-30 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="flex items-center justify-center p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-all border border-slate-700"
            title="Back to Landing Page"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex flex-col">
            <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
              Chakraborty's First Classes <span className="text-xs px-2.5 py-0.5 rounded-full bg-secondary/15 text-secondary border border-secondary/20">Admin Panel</span>
            </h2>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
          Connected Live
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-grow flex flex-col lg:flex-row">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 border-b lg:border-b-0 lg:border-r border-slate-800 p-6 flex flex-col gap-6">
          <nav className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-3 lg:pb-0">
            <button
              onClick={() => { setActiveTab('overview'); setSearchQuery(''); }}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all whitespace-nowrap",
                activeTab === 'overview' 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              )}
            >
              <BookOpen size={18} /> Overview
            </button>
            <button
              onClick={() => { setActiveTab('enrollments'); setSearchQuery(''); }}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all whitespace-nowrap",
                activeTab === 'enrollments' 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              )}
            >
              <GraduationCap size={18} /> Enrollments
              {enrollments.filter(e => e.status === 'Pending').length > 0 && (
                <span className="ml-auto bg-secondary text-dark font-bold text-xs px-2 py-0.5 rounded-full">
                  {enrollments.filter(e => e.status === 'Pending').length}
                </span>
              )}
            </button>
            <button
              onClick={() => { setActiveTab('inquiries'); setSearchQuery(''); }}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all whitespace-nowrap",
                activeTab === 'inquiries' 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              )}
            >
              <MessageSquare size={18} /> Inquiries
            </button>
            <button
              onClick={() => { setActiveTab('courses'); setSearchQuery(''); }}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all whitespace-nowrap",
                activeTab === 'courses' 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              )}
            >
              <PencilRuler size={18} /> Manage Offerings
            </button>
          </nav>

          <div className="mt-auto hidden lg:block border-t border-slate-800 pt-6">
            <button
              onClick={onBack}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-slate-300 font-semibold border border-slate-700/50 hover:text-white transition-all"
            >
              <ArrowLeft size={16} /> Exit Panel
            </button>
          </div>
        </aside>

        {/* Content Panel */}
        <main className="flex-grow p-6 lg:p-8 bg-[#0B0F19] overflow-y-auto max-h-[calc(100vh-80px)]">
          {loading ? (
            <div className="flex flex-col gap-4 justify-center items-center h-96">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
              <p className="text-slate-400 text-sm font-medium">Fetching real-time updates...</p>
            </div>
          ) : (
            <>
              {/* TAB: OVERVIEW */}
              {activeTab === 'overview' && stats && (
                <div className="space-y-8">
                  {/* Title */}
                  <div>
                    <h3 className="text-2xl font-bold text-white">Academy Analytics</h3>
                    <p className="text-slate-400 text-sm mt-1">Snapshot of registration, student interest, and educational catalog statistics.</p>
                  </div>

                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-5 shadow-lg shadow-[#000]/10 relative overflow-hidden group">
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500" />
                      <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                        <Users size={24} />
                      </div>
                      <div>
                        <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block">Enrollment Forms</span>
                        <span className="text-3xl font-bold text-white mt-1 block">{stats.counts.enrollments}</span>
                      </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-5 shadow-lg shadow-[#000]/10 relative overflow-hidden group">
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500" />
                      <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
                        <Clock size={24} />
                      </div>
                      <div>
                        <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block">Pending Applications</span>
                        <span className="text-3xl font-bold text-white mt-1 block">{stats.statusBreakdown.Pending}</span>
                      </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-5 shadow-lg shadow-[#000]/10 relative overflow-hidden group">
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500" />
                      <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                        <CheckCircle size={24} />
                      </div>
                      <div>
                        <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block">Approved Seats</span>
                        <span className="text-3xl font-bold text-white mt-1 block">{stats.statusBreakdown.Approved}</span>
                      </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-5 shadow-lg shadow-[#000]/10 relative overflow-hidden group">
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-purple-500" />
                      <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                        <MessageSquare size={24} />
                      </div>
                      <div>
                        <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block">Student Inquiries</span>
                        <span className="text-3xl font-bold text-white mt-1 block">{stats.counts.inquiries}</span>
                      </div>
                    </div>
                  </div>

                  {/* Course Registration Breakdown */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
                      <h4 className="text-lg font-bold text-white mb-6">Course Registration Standings</h4>
                      {stats.enrollmentsByCourse.length === 0 ? (
                        <p className="text-slate-500 text-sm">No courses defined or enrolled.</p>
                      ) : (
                        <div className="space-y-5">
                          {stats.enrollmentsByCourse.map((c, i) => {
                            const total = stats.counts.enrollments || 1;
                            const percentage = Math.round((c.value / total) * 100);
                            return (
                              <div key={i} className="space-y-1.5">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="font-semibold text-slate-300">{c.name}</span>
                                  <span className="font-bold text-slate-100">{c.value} enrolled ({percentage}%)</span>
                                </div>
                                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                                  <div 
                                    className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-1000"
                                    style={{ width: `${percentage}%` }}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-md flex flex-col justify-between">
                      <div>
                        <h4 className="text-lg font-bold text-white mb-2">Admissions Funnel Summary</h4>
                        <p className="text-slate-400 text-xs mb-6">Overview of lead statuses in current batch enrollment cycle.</p>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-center my-auto">
                        <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800">
                          <span className="text-xs text-slate-400 font-semibold block uppercase">Pending Review</span>
                          <span className="text-2xl font-bold text-amber-400 mt-2 block">{stats.statusBreakdown.Pending}</span>
                        </div>
                        <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800">
                          <span className="text-xs text-slate-400 font-semibold block uppercase">Contacted</span>
                          <span className="text-2xl font-bold text-blue-400 mt-2 block">{stats.statusBreakdown.Contacted}</span>
                        </div>
                        <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800">
                          <span className="text-xs text-slate-400 font-semibold block uppercase">Confirmed</span>
                          <span className="text-2xl font-bold text-green-400 mt-2 block">{stats.statusBreakdown.Approved}</span>
                        </div>
                      </div>

                      <div className="mt-8 text-xs text-slate-400 text-center border-t border-slate-800/60 pt-4">
                        Admissions data syncs automatically with local data repositories.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: ENROLLMENTS */}
              {activeTab === 'enrollments' && (
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-bold text-white">Student Enrollments ({filteredEnrollments.length})</h3>
                      <p className="text-slate-400 text-sm mt-1">Review student applications, manage contact statuses, and confirm class seats.</p>
                    </div>
                    {/* Search bar */}
                    <div className="relative w-full md:w-80">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input
                        type="text"
                        placeholder="Search student, course, or status..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl focus:outline-none focus:border-secondary text-sm placeholder-slate-500 text-white"
                      />
                    </div>
                  </div>

                  {/* Enrollments Table */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
                    {filteredEnrollments.length === 0 ? (
                      <div className="p-12 text-center text-slate-500">
                        <Users size={48} className="mx-auto text-slate-600 mb-4" />
                        <p className="text-base font-semibold">No enrollment records found.</p>
                        <p className="text-sm text-slate-500 mt-1">Try modifying your search or wait for submissions.</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left text-sm text-slate-300">
                          <thead className="bg-slate-950 text-slate-400 font-semibold uppercase text-xs border-b border-slate-800">
                            <tr>
                              <th className="px-6 py-4">Student</th>
                              <th className="px-6 py-4">Contact Info</th>
                              <th className="px-6 py-4">Course Selection</th>
                              <th className="px-6 py-4">Status</th>
                              <th className="px-6 py-4">Application Date</th>
                              <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/60">
                            {filteredEnrollments.map((e) => (
                              <tr key={e.id} className="hover:bg-slate-800/20 transition-all">
                                <td className="px-6 py-4 font-bold text-white">
                                  {e.firstName} {e.lastName}
                                  {e.message && (
                                    <p className="text-xs text-slate-400 font-normal italic mt-1 max-w-xs truncate" title={e.message}>
                                      "{e.message}"
                                    </p>
                                  )}
                                </td>
                                <td className="px-6 py-4 space-y-1">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-slate-400">Mail:</span>
                                    <a href={`mailto:${e.email}`} className="text-accent hover:underline">{e.email}</a>
                                  </div>
                                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                    <span>Phone:</span>
                                    <a href={`tel:${e.phone}`} className="hover:underline">{e.phone}</a>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <span className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs font-semibold text-white">
                                    {e.courseTitle}
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  <select
                                    value={e.status}
                                    onChange={(evt) => handleStatusChange(e.id, evt.target.value)}
                                    className={cn(
                                      "px-2.5 py-1 rounded-lg text-xs font-bold border outline-none cursor-pointer",
                                      e.status === 'Pending' && "bg-amber-500/10 text-amber-400 border-amber-500/20",
                                      e.status === 'Contacted' && "bg-blue-500/10 text-blue-400 border-blue-500/20",
                                      e.status === 'Approved' && "bg-green-500/10 text-green-400 border-green-500/20",
                                      e.status === 'Cancelled' && "bg-red-500/10 text-red-400 border-red-500/20"
                                    )}
                                  >
                                    <option value="Pending" className="bg-[#0F172A] text-amber-400">Pending</option>
                                    <option value="Contacted" className="bg-[#0F172A] text-blue-400">Contacted</option>
                                    <option value="Approved" className="bg-[#0F172A] text-green-400">Approved</option>
                                    <option value="Cancelled" className="bg-[#0F172A] text-red-400">Cancelled</option>
                                  </select>
                                </td>
                                <td className="px-6 py-4 text-slate-400">
                                  {new Date(e.date).toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric'
                                  })}
                                </td>
                                <td className="px-6 py-4 text-right">
                                  <button
                                    onClick={() => handleDeleteEnrollment(e.id)}
                                    className="p-2 rounded-lg bg-slate-800 text-red-400 hover:text-white hover:bg-red-500/20 transition-all border border-slate-700/50"
                                    title="Delete Enrollment"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB: INQUIRIES */}
              {activeTab === 'inquiries' && (
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-bold text-white">General Inquiries ({filteredInquiries.length})</h3>
                      <p className="text-slate-400 text-sm mt-1">Read questions, emails, and phone requests sent via the contact page form.</p>
                    </div>
                    {/* Search bar */}
                    <div className="relative w-full md:w-80">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input
                        type="text"
                        placeholder="Search name, phone, message..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl focus:outline-none focus:border-secondary text-sm placeholder-slate-500 text-white"
                      />
                    </div>
                  </div>

                  {/* Inquiries Table */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
                    {filteredInquiries.length === 0 ? (
                      <div className="p-12 text-center text-slate-500">
                        <MessageSquare size={48} className="mx-auto text-slate-600 mb-4" />
                        <p className="text-base font-semibold">No inquiry records found.</p>
                        <p className="text-sm text-slate-500 mt-1">Contact form responses will load here dynamically.</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left text-sm text-slate-300">
                          <thead className="bg-slate-950 text-slate-400 font-semibold uppercase text-xs border-b border-slate-800">
                            <tr>
                              <th className="px-6 py-4">Sender</th>
                              <th className="px-6 py-4">Contact Detail</th>
                              <th className="px-6 py-4">Inquiry / Message</th>
                              <th className="px-6 py-4">Date Submitted</th>
                              <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/60">
                            {filteredInquiries.map((i) => (
                              <tr key={i.id} className="hover:bg-slate-800/20 transition-all">
                                <td className="px-6 py-4 font-bold text-white">
                                  {i.firstName} {i.lastName}
                                </td>
                                <td className="px-6 py-4 space-y-1">
                                  <div>
                                    <a href={`mailto:${i.email}`} className="text-accent hover:underline">{i.email}</a>
                                  </div>
                                  <div className="text-xs text-slate-400">
                                    <a href={`tel:${i.phone}`} className="hover:underline">{i.phone}</a>
                                  </div>
                                </td>
                                <td className="px-6 py-4 max-w-sm">
                                  <p className="text-slate-200 leading-relaxed break-words whitespace-pre-wrap">
                                    {i.message}
                                  </p>
                                </td>
                                <td className="px-6 py-4 text-slate-400">
                                  {new Date(i.date).toLocaleString('en-IN', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </td>
                                <td className="px-6 py-4 text-right">
                                  <button
                                    onClick={() => handleDeleteInquiry(i.id)}
                                    className="p-2 rounded-lg bg-slate-800 text-red-400 hover:text-white hover:bg-red-500/20 transition-all border border-slate-700/50"
                                    title="Delete Inquiry"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB: MANAGE COURSES */}
              {activeTab === 'courses' && (
                <div className="space-y-6">
                  {/* Tab Title */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-white">Manage Course Offerings ({courses.length})</h3>
                      <p className="text-slate-400 text-sm mt-1">Create, edit, or remove catalog course offerings appearing on the main website.</p>
                    </div>
                    {!isEditingCourse && (
                      <button
                        onClick={handleOpenAddCourse}
                        className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold flex items-center gap-2 hover:shadow-lg hover:shadow-primary/20 text-sm transition-all"
                      >
                        <Plus size={18} /> Add Course
                      </button>
                    )}
                  </div>

                  {/* Course Editor Form */}
                  {isEditingCourse && (
                    <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
                      <div className="flex items-center justify-between pb-4 border-b border-slate-850">
                        <h4 className="text-lg font-bold text-white flex items-center gap-2">
                          {courseForm.id ? <Edit3 size={18} /> : <Plus size={18} />}
                          {courseForm.id ? 'Edit Existing Offering' : 'Register New Offering'}
                        </h4>
                        <button
                          onClick={() => setIsEditingCourse(false)}
                          className="text-slate-400 hover:text-white hover:bg-slate-800 p-1.5 rounded-full transition-all"
                        >
                          <X size={18} />
                        </button>
                      </div>

                      {courseError && (
                        <div className="p-4 bg-red-500/10 border border-red-500/25 text-red-400 text-sm rounded-xl flex items-center gap-2">
                          <AlertCircle size={18} />
                          {courseError}
                        </div>
                      )}

                      <form onSubmit={handleCourseSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 block uppercase">Course Title *</label>
                            <input
                              type="text"
                              required
                              value={courseForm.title}
                              onChange={e => setCourseForm(prev => ({ ...prev, title: e.target.value }))}
                              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-secondary text-sm text-white"
                              placeholder="e.g. Science Coaching (Physics, Chemistry)"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 block uppercase">Select Visual Icon</label>
                            <select
                              value={courseForm.icon}
                              onChange={e => setCourseForm(prev => ({ ...prev, icon: e.target.value }))}
                              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-secondary text-sm text-white"
                            >
                              {iconOptions.map(ico => (
                                <option key={ico} value={ico}>{ico}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-400 block uppercase">Brief Description *</label>
                          <textarea
                            required
                            rows="3"
                            value={courseForm.desc}
                            onChange={e => setCourseForm(prev => ({ ...prev, desc: e.target.value }))}
                            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-secondary text-sm text-white resize-none"
                            placeholder="Provide a comprehensive summary of course coverage, classes, syllabus, target boards..."
                          />
                        </div>

                        <div className="space-y-4">
                          <label className="text-xs font-bold text-slate-400 block uppercase">Color Theme Style</label>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                            {colorOptions.map(opt => (
                              <button
                                key={opt.value}
                                type="button"
                                onClick={() => handleCourseColorChange(opt.value)}
                                className={cn(
                                  "px-4 py-3 rounded-xl border text-xs font-bold flex items-center justify-between gap-1 transition-all",
                                  courseForm.color === opt.value
                                    ? "bg-slate-800 text-white border-secondary"
                                    : "bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700"
                                )}
                              >
                                <span>{opt.label}</span>
                                <div className={cn("w-3 h-3 rounded-full", opt.value.replace('text-', 'bg-'))} />
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-4 pt-4 border-t border-slate-850">
                          <button
                            type="submit"
                            className="px-6 py-3 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary-dark transition-all"
                          >
                            Save offering
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsEditingCourse(false)}
                            className="px-6 py-3 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-300 text-sm transition-all"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Course Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map(c => (
                      <div key={c.id} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-md flex flex-col justify-between relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent" />
                        <div>
                          <div className="flex items-start justify-between mb-4">
                            {renderIcon(c.icon, c.color, c.bg)}
                            <div className="flex gap-2 opacity-10 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleOpenEditCourse(c)}
                                className="p-1.5 rounded bg-slate-800 border border-slate-700 text-secondary hover:text-white hover:bg-secondary transition-all"
                                title="Edit Course"
                              >
                                <Edit3 size={14} />
                              </button>
                              <button
                                onClick={() => handleDeleteCourse(c.id)}
                                className="p-1.5 rounded bg-slate-800 border border-slate-700 text-red-400 hover:text-white hover:bg-red-500 transition-all"
                                title="Delete Course"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>

                          <h4 className="text-lg font-bold text-white group-hover:text-secondary transition-all">{c.title}</h4>
                          <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                            {c.desc}
                          </p>
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-850 flex items-center justify-between text-xs text-slate-500">
                          <span className="font-semibold uppercase tracking-wider">{c.icon} Icon</span>
                          <span className="capitalize">{c.color.split('-')[1]} Theme</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
