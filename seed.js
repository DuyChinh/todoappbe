require('dotenv').config();
const mongoose = require('mongoose');
const Template = require('./models/Template');
const Task = require('./models/Task');

const templates = [
  {
    dayOfWeek: 1, // Thứ 2
    items: [
      { time: '06:30', content: 'Nghe chép chính tả IELTS (Part 1/2)' },
      { time: '20:00', content: 'Cày Reading (20p giải đề, 70p tra từ)' },
      { time: '21:30', content: 'Luyện Writing (Task 1 hoặc 2)' }
    ]
  },
  {
    dayOfWeek: 3, // Thứ 4
    items: [
      { time: '06:30', content: 'Nghe chép chính tả IELTS (Part 1/2)' },
      { time: '20:00', content: 'Cày Reading (20p giải đề, 70p tra từ)' },
      { time: '21:30', content: 'Luyện Writing (Task 1 hoặc 2)' }
    ]
  },
  {
    dayOfWeek: 2, // Thứ 3
    items: [
      { time: '06:30', content: 'Nghe chép chính tả IELTS (Part 1/2)' },
      { time: '20:00', content: 'Cày Reading (20p giải đề, 70p tra từ)' },
      { time: '21:30', content: 'Luyện Speaking (Tự ghi âm, sửa lỗi)' }
    ]
  },
  {
    dayOfWeek: 4, // Thứ 5
    items: [
      { time: '06:30', content: 'Nghe chép chính tả IELTS (Part 1/2)' },
      { time: '22:00', content: 'Xem video AWS SAA (tiếng Anh)' }
    ]
  },
  {
    dayOfWeek: 5, // Thứ 6
    items: [
      { time: '06:30', content: 'Nghe chép chính tả IELTS (Part 1/2)' },
      { time: '20:00', content: 'Cày Reading (20p giải đề, 70p tra từ)' },
      { time: '21:30', content: 'Luyện Speaking (Tự ghi âm, sửa lỗi)' }
    ]
  },
  {
    dayOfWeek: 6, // Thứ 7
    items: [
      { time: '08:30', content: 'Thi thử Full 4 kỹ năng IELTS' },
      { time: '14:00', content: 'Chữa bài Reading, lập bảng từ vựng' },
      { time: '20:00', content: 'Giữ nhịp N2: Giải 1 đề Đọc/Nghe' }
    ]
  },
  {
    dayOfWeek: 0, // Chủ Nhật
    items: [
      { time: '06:30', content: 'Ngủ bù hoặc làm bài tập nợ' },
      { time: '14:00', content: 'Chữa bài Listening, luyện Speaking' },
      { time: '20:00', content: 'Giữ nhịp AWS: Xem video SAA' }
    ]
  }
];

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('MongoDB connected');
    
    // Clear old templates
    await Template.deleteMany({});
    console.log('Old templates removed');
    
    // Insert new templates
    await Template.insertMany(templates);
    console.log('Templates seeded successfully');
    
    process.exit(0);
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
