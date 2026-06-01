import { readData, writeData } from '../utils/db.js';

export const getCourses = (req, res) => {
  try {
    const courses = readData('courses.json');
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving courses', error: error.message });
  }
};

export const addCourse = (req, res) => {
  try {
    const { title, desc, icon, color, bg } = req.body;
    if (!title || !desc) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    const courses = readData('courses.json');
    const newCourse = {
      id: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      title,
      desc,
      icon: icon || 'Book',
      color: color || 'text-blue-500',
      bg: bg || 'bg-blue-50'
    };

    // Ensure ID unique
    const exists = courses.some(c => c.id === newCourse.id);
    if (exists) {
      newCourse.id = `${newCourse.id}-${Date.now()}`;
    }

    courses.push(newCourse);
    writeData('courses.json', courses);
    res.status(201).json(newCourse);
  } catch (error) {
    res.status(500).json({ message: 'Error adding course', error: error.message });
  }
};

export const updateCourse = (req, res) => {
  try {
    const { id } = req.params;
    const { title, desc, icon, color, bg } = req.body;

    const courses = readData('courses.json');
    const courseIndex = courses.findIndex(c => c.id === id);

    if (courseIndex === -1) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const updatedCourse = {
      ...courses[courseIndex],
      title: title || courses[courseIndex].title,
      desc: desc || courses[courseIndex].desc,
      icon: icon || courses[courseIndex].icon,
      color: color || courses[courseIndex].color,
      bg: bg || courses[courseIndex].bg
    };

    courses[courseIndex] = updatedCourse;
    writeData('courses.json', courses);
    res.status(200).json(updatedCourse);
  } catch (error) {
    res.status(500).json({ message: 'Error updating course', error: error.message });
  }
};

export const deleteCourse = (req, res) => {
  try {
    const { id } = req.params;
    const courses = readData('courses.json');
    const filteredCourses = courses.filter(c => c.id !== id);

    if (courses.length === filteredCourses.length) {
      return res.status(404).json({ message: 'Course not found' });
    }

    writeData('courses.json', filteredCourses);
    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting course', error: error.message });
  }
};
