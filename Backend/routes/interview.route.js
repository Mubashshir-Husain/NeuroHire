import { Router } from "express";
import  isAuth  from "../middlewares/isAuth.middleware.js";
import { upload } from "../middlewares/multer.js";
import { analyzeResume, finishInterview, generateQuestions, getInterviewReport, getMyInterviews, submitAnswer } from "../controllers/interview.controller.js";

const router = Router();

router.post("/resume", isAuth, upload.single("resume"), analyzeResume)
router.post("/generate-question", isAuth, generateQuestions)
router.post("/submit-answer", isAuth, submitAnswer)
router.post("/finish", isAuth, finishInterview)

router.get("/get-interview", isAuth, getMyInterviews)
router.get("/report/:id", isAuth, getInterviewReport)


export default router