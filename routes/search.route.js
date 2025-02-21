import express from "express";
import { searchResumes } from "../controllers/search.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router()

router.post('/find', verifyToken, searchResumes)

export default router