import { readData, writeData } from '../utils/db.js';

export const getEnrollments = (req, res) => {
  try {
    const enrollments = readData('enrollments.json');
    // Sort by date descending
    enrollments.sort((a, b) => new Date(b.date) - new Date(a.date));
    res.status(200).json(enrollments);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving enrollments', error: error.message });
  }
};

export const createEnrollment = (req, res) => {
  try {
    const { firstName, lastName, email, phone, courseId, courseTitle, message } = req.body;

    if (!firstName || !lastName || !email || !phone || !courseTitle) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const enrollments = readData('enrollments.json');
    const newEnrollment = {
      id: `enroll-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      firstName,
      lastName,
      email,
      phone,
      courseId: courseId || 'general',
      courseTitle,
      message: message || '',
      status: 'Pending', // Pending, Contacted, Approved, Cancelled
      date: new Date().toISOString()
    };

    enrollments.push(newEnrollment);
    writeData('enrollments.json', enrollments);
    res.status(201).json({ message: 'Enrollment submitted successfully!', enrollment: newEnrollment });
  } catch (error) {
    res.status(500).json({ message: 'Error creating enrollment', error: error.message });
  }
};

export const updateEnrollmentStatus = (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const enrollments = readData('enrollments.json');
    const index = enrollments.findIndex(e => e.id === id);

    if (index === -1) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    enrollments[index].status = status;
    writeData('enrollments.json', enrollments);

    res.status(200).json({ message: 'Status updated successfully', enrollment: enrollments[index] });
  } catch (error) {
    res.status(500).json({ message: 'Error updating enrollment status', error: error.message });
  }
};

export const deleteEnrollment = (req, res) => {
  try {
    const { id } = req.params;
    const enrollments = readData('enrollments.json');
    const filtered = enrollments.filter(e => e.id !== id);

    if (enrollments.length === filtered.length) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    writeData('enrollments.json', filtered);
    res.status(200).json({ message: 'Enrollment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting enrollment', error: error.message });
  }
};
