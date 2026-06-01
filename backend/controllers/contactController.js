import { readData, writeData } from '../utils/db.js';

export const getInquiries = (req, res) => {
  try {
    const inquiries = readData('inquiries.json');
    // Sort by date descending
    inquiries.sort((a, b) => new Date(b.date) - new Date(a.date));
    res.status(200).json(inquiries);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving inquiries', error: error.message });
  }
};

export const createInquiry = (req, res) => {
  try {
    const { firstName, lastName, email, phone, message } = req.body;

    if (!firstName || !lastName || !email || !phone || !message) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    const inquiries = readData('inquiries.json');
    const newInquiry = {
      id: `inq-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      firstName,
      lastName,
      email,
      phone,
      message,
      date: new Date().toISOString()
    };

    inquiries.push(newInquiry);
    writeData('inquiries.json', inquiries);
    res.status(201).json({ message: 'Inquiry received successfully!', inquiry: newInquiry });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting inquiry', error: error.message });
  }
};

export const deleteInquiry = (req, res) => {
  try {
    const { id } = req.params;
    const inquiries = readData('inquiries.json');
    const filtered = inquiries.filter(i => i.id !== id);

    if (inquiries.length === filtered.length) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }

    writeData('inquiries.json', filtered);
    res.status(200).json({ message: 'Inquiry deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting inquiry', error: error.message });
  }
};
