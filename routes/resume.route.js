import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { processResume } from "../controllers/resume.controller.js";

const router = express.Router()

router.post('/process', verifyToken, processResume)

export default router