import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '..', 'data');

// Default courses list to seed the DB
const DEFAULT_COURSES = [
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

// Ensure the data directory exists
export const initDB = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  const coursesPath = path.join(DATA_DIR, 'courses.json');
  const enrollmentsPath = path.join(DATA_DIR, 'enrollments.json');
  const inquiriesPath = path.join(DATA_DIR, 'inquiries.json');

  if (!fs.existsSync(coursesPath)) {
    fs.writeFileSync(coursesPath, JSON.stringify(DEFAULT_COURSES, null, 2), 'utf-8');
    console.log('Seeded default courses successfully.');
  }

  if (!fs.existsSync(enrollmentsPath)) {
    fs.writeFileSync(enrollmentsPath, JSON.stringify([], null, 2), 'utf-8');
  }

  if (!fs.existsSync(inquiriesPath)) {
    fs.writeFileSync(inquiriesPath, JSON.stringify([], null, 2), 'utf-8');
  }
};

// Safe atomic read & write helpers
export const readData = (filename) => {
  const filePath = path.join(DATA_DIR, filename);
  try {
    if (!fs.existsSync(filePath)) {
      initDB();
    }
    const rawData = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(rawData);
  } catch (error) {
    console.error(`Error reading database file ${filename}:`, error);
    return [];
  }
};

export const writeData = (filename, data) => {
  const filePath = path.join(DATA_DIR, filename);
  const tempPath = `${filePath}.tmp`;
  try {
    // Perform an atomic write to prevent file corruption
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempPath, filePath);
    return true;
  } catch (error) {
    console.error(`Error writing database file ${filename}:`, error);
    if (fs.existsSync(tempPath)) {
      try { fs.unlinkSync(tempPath); } catch (_) {}
    }
    return false;
  }
};
