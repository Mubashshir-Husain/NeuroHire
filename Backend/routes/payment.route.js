import { Router } from "express";
import { createOrder, verifyPayment } from "../controllers/payment.controller.js";
import isAuth from "../middlewares/isAuth.middleware.js";

const router = Router()

router.post("/order", isAuth, createOrder)
router.post("/verify", isAuth, verifyPayment)


export default router