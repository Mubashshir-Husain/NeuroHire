import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDb from './config/connectDb.js'
import cookieParser from 'cookie-parser'
import autheRouter from './routes/auth.route.js'
import userRouter from './routes/user.route.js'
import interviewRouter from './routes/interview.route.js'
import paymentRouter from './routes/payment.route.js'
dotenv.config()

const app = express()

app.use(cors({
    origin: "https://neurohire-j0es.onrender.com/",
    credentials: true
}))

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))

connectDb()

app.use("/api/auth", autheRouter)
app.use("/api/user", userRouter)
app.use("/api/interview", interviewRouter)
app.use("/api/payment", paymentRouter)

app.get('/', (req, res) => {
    res.json({ message: "Server is running..." })
})

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})