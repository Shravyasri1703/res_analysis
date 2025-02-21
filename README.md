# Resume Analysis API

## Description

This project is a mini backend service for a fictional Resume Analysis App. The backend is built using Node.js and Express.js, with MongoDB (Cloud Version) as the database. It integrates with Google Gemini API to extract and enrich resume data. The backend includes JWT authentication and secure data encryption for sensitive fields. The API is deployed on Render/Vercel/Railway using a free-tier plan.

## Features

User Authentication API with JWT

Resume Data Enrichment API (Extracts text from PDF, processes it via Google Gemini, and stores it in MongoDB)

Resume Search API (Searches for resumes in the database based on name query)

MongoDB Cloud Integration

Google Gemini LLM API Integration

Data Encryption for Sensitive Fields

JWT Authentication for API Security

Error Handling & Validation

Cloud Deployment



## Live Demo

🚀 Hosted on Vercel: https://res-analysis.vercel.app/

## Tech Stack

Backend: Node.js, Express.js

Database: MongoDB

Authentication: JWT (JSON Web Token)

Hosting: Vercel

# Installation & Setup

Prerequisites

Ensure you have the following installed:

Node.js (v16 or later)

MongoDB Atlas Account (for cloud database setup)

Google Gemini API Key

Postman (for API testing)

### 1. Clone the Repository
```
 git clone https://github.com/your-repo/user-management.git
 cd user-management

 ```

### 2. Install Dependencies
```
npm install

```
### 3. Configure Environment Variables

Create a .env file and add:
```
PORT=5000
MONGO_URI=<your_mongodb_cloud_connection_string>
JWT_SECRET=<your_jwt_secret_key>
GEMINI_API_KEY=<your_google_gemini_api_key>

```
### 4. Run the Application

Development Mode

npm run dev

Production Mode

npm start

# API Documentation

## User Authentication

### 1. Login User

Endpoint: POST /api/auth/login
Request Body:
```

{
    {
  "username": "naval.ravikant",
  "password": "05111974"
}
```
Response:
```
{
  "JWT": "<jwt_token>"
}

```
### 2. Resume Data Enrichment API


Endpoint: POST /api/resume/process

Headers: 
```
Authorization: Bearer <JWT_TOKEN>

```

Request Body:
```

{
  "url": "https://www.dhli.in/uploaded_files/resumes/resume_3404.pdf"
}

```

Response:
```
{
  "name": "John Doe",
  "email": "johndoe@example.com",
  "education": {
    "degree": "B.Tech",
    "branch": "Computer Science",
    "institution": "XYZ University",
    "year": "2020"
  },
  "experience": {
    "job_title": "Software Engineer",
    "company": "ABC Corp",
    "start_date": "2021-01-01",
    "end_date": "2023-12-31"
  },
  "skills": ["JavaScript", "React", "Node.js"],
  "summary": "John Doe is a skilled software engineer with expertise in full-stack development."
}

```


### 3. Resume Search API 

Endpoint: POST /api/search/find
Request Body:
```
{
  "name": "Raj"
}
```
Response:
```
[
  { "name": "Raj Singh", "email": "raj.singh@example.com" },
  { "name": "Vanraj Mehta", "email": "vanraj.mehta@example.com" },
  { "name": "Prem Raj", "email": "prem.raj@example.com" }
]
```
