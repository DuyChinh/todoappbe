require('dotenv').config();
const mongoose = require('mongoose');
const Template = require('./models/Template');
const Task = require('./models/Task');
const { getSeedTemplates } = require('./data/n2Templates');

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('MongoDB connected for seeding JLPT N2 Sprint schedule...');
    
    // Clear old templates
    await Template.deleteMany({});
    console.log('Old templates removed');
    
    // Clear old tasks so the app initializes with fresh JLPT N2 tasks
    await Task.deleteMany({});
    console.log('Old tasks cleared');
    
    // Insert new templates
    const templates = getSeedTemplates();
    await Template.insertMany(templates);
    console.log('JLPT N2 Templates seeded successfully!');
    
    process.exit(0);
  })
  .catch(err => {
    console.error('MongoDB seeding error:', err);
    process.exit(1);
  });
