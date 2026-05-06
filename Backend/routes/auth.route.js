import { Router } from "express"
import { googleAuth, logOut } from "../controllers/auth.controller.js"

const router = Router()

router.post("/googleAuth", googleAuth)
router.post("/logOut", logOut)


export default router