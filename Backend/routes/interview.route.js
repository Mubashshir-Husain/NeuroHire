import { Router } from "express";
import  isAuth  from "../middlewares/isAuth.middleware.js";
import { upload } from "../middlewares/multer.js";
import { analyzeResume, finishInterview, generateQuestions, submitAnswer } from "../controllers/interview.controller.js";

const router = Router();

router.post("/resume", isAuth, upload.single("resume"), analyzeResume)
router.post("/generate-question", isAuth, generateQuestions)
router.post("/submit-answer", isAuth, submitAnswer)
router.post("/finish", isAuth, finishInterview)


export default router