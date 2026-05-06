import { Router } from "express";
import { getCurrentUser } from "../controllers/user.controller.js";
import isAuth from "../middlewares/isAuth.middleware.js";


let router = Router()

router.get("/currentUser", isAuth, getCurrentUser)

export default router