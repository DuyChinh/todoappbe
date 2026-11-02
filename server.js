require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const taskRoutes = require('./routes/tasks');
const templateRoutes = require('./routes/templates');
const mockExamRoutes = require('./routes/mockExams');
const errorLogRoutes = require('./routes/errorLogs');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/tasks', taskRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/mock-exams', mockExamRoutes);
app.use('/api/error-logs', errorLogRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'JLPT N2 Sprint Tracker API',
    time: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
