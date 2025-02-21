import express from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv'
import cors from 'cors'
import authRoute from './routes/auth.route.js'
import resumeRoute from './routes/resume.route.js'
import searchRoutes from './routes/search.route.js'

const app = express()

dotenv.config()

app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send("Welcome to Resume Analyzer using Gemini AI")
})
app.use('/api/auth', authRoute)
app.use('/api/resume', resumeRoute)
app.use('/api/search', searchRoutes)

const port = process.env.PORT

const url = process.env.MONGO_URI

app.listen(port, ()=>{
    console.log("Server started on : ",port)
})

const connection = async () => {
    try{
    await mongoose.connect(url)
    console.log("Connected to DB")
    }catch(err){
        console.log("Error connecting to DB",err)
    }
}

connection()