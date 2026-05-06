import { Router } from "express";
import  isAuth  from "../middlewares/isAuth.middleware.js";
import { upload } from "../middlewares/multer.js";
import { analyzeResume } from "../controllers/interview.controller.js";

const router = Router();

router.post("/resume", isAuth, upload.single("resume"), analyzeResume)


export default router