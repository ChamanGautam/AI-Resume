const mongoose = require('mongoose');

// Experience Schema
const experienceSchema = new mongoose.Schema({
  title: String,
  companyName: String,
  city: String,
  state: String,
  startDate: String,
  endDate: String,
  workSummery: String,
});

// Education Schema (if you have an education section)
const educationSchema = new mongoose.Schema({
  universityName: String,
  degree: String,
  major: String,
  sDate: String,
  eDate: String,
  desc: String,
});

// Skills Schema (if you support rating for skills)
const skillSchema = new mongoose.Schema({
  skill: String,
  rating: Number,
});

// Main Resume Schema
const resumeSchema = new mongoose.Schema({
  resumetitle: String,
  uuid: String,
  useremail: String,
  name: String,
  firstName: String,
  lastName: String,
  address: String,
  jobTitle: String,
  phone: String,
  email: String,
  summery: String,

  // Arrays for experience, education, and skills
  experience: [experienceSchema],
  education: [educationSchema],
  skills: [skillSchema],
});

module.exports = mongoose.model('AiResume', resumeSchema);
