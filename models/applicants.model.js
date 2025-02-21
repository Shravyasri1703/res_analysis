// src/models/applicant.js
import mongoose from 'mongoose';

const applicantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true
  },
  email: {
    type: String,
    required: true
  },
  education: {
    degree: {
      type: String,
      required: true,
      default: "Not specified"
    },
    branch: {
      type: String,
      required: true,
      default: "Not specified"
    },
    institution: {
      type: String,
      required: true,
      default: "Not specified"
    },
    year: {
      type: String,
      required: true,
      default: "Not specified"
    }
  },
  experience: {
    job_title: {
      type: String,
      required: true,
      default: "Not specified"
    },
    company: {
      type: String,
      required: true,
      default: "Not specified"
    },
    start_date: {
      type: String,
      required: true,
      default: "Not specified"
    },
    end_date: {
      type: String,
      required: true,
      default: "Not specified"
    }
  },
  skills: {
    type: [String],
    required: true,
    default: ["Not specified"]
  },
  summary: {
    type: String,
    required: true,
    default: "Not specified"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add a text index for better searching capabilities
applicantSchema.index({ name: 'text' });

export default mongoose.model('Applicant', applicantSchema);