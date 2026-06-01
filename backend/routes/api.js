import express from 'express';
import { getCourses, addCourse, updateCourse, deleteCourse } from '../controllers/courseController.js';
import { getEnrollments, createEnrollment, updateEnrollmentStatus, deleteEnrollment } from '../controllers/enrollmentController.js';
import { getInquiries, createInquiry, deleteInquiry } from '../controllers/contactController.js';
import { readData } from '../utils/db.js';

const router = express.Router();

// --- Course Routes ---
router.get('/courses', getCourses);
router.post('/admin/courses', addCourse);
router.put('/admin/courses/:id', updateCourse);
router.delete('/admin/courses/:id', deleteCourse);

// --- Enrollment Routes ---
router.post('/enroll', createEnrollment);
router.get('/admin/enrollments', getEnrollments);
router.put('/admin/enrollments/:id/status', updateEnrollmentStatus);
router.delete('/admin/enrollments/:id', deleteEnrollment);

// --- Contact / Inquiry Routes ---
router.post('/contact', createInquiry);
router.get('/admin/contacts', getInquiries);
router.delete('/admin/contacts/:id', deleteInquiry);

// --- Admin Stats Route ---
router.get('/admin/stats', (req, res) => {
  try {
    const courses = readData('courses.json');
    const enrollments = readData('enrollments.json');
    const inquiries = readData('inquiries.json');

    // Count enrollments by course
    const courseStats = {};
    courses.forEach(c => {
      courseStats[c.title] = 0;
    });

    enrollments.forEach(e => {
      if (courseStats[e.courseTitle] !== undefined) {
        courseStats[e.courseTitle]++;
      } else {
        courseStats[e.courseTitle] = 1;
      }
    });

    const formattedCourseStats = Object.keys(courseStats).map(name => ({
      name,
      value: courseStats[name]
    }));

    // Status breakdown for enrollments
    const statusStats = { Pending: 0, Contacted: 0, Approved: 0 };
    enrollments.forEach(e => {
      if (statusStats[e.status] !== undefined) {
        statusStats[e.status]++;
      }
    });

    res.status(200).json({
      counts: {
        courses: courses.length,
        enrollments: enrollments.length,
        inquiries: inquiries.length
      },
      enrollmentsByCourse: formattedCourseStats,
      statusBreakdown: statusStats
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving statistics', error: error.message });
  }
});

export default router;
