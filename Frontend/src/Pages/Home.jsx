import React from "react"
import NavBar from "../Components/NavBar.jsx"
import { useSelector } from "react-redux"
import { motion } from "motion/react"
import {
    BsRobot,
    BsMic,
    BsClock,
    BsBarChart,
    BsFileEarmarkText,
    BsChat
} from "react-icons/bs";
import { HiSparkles } from "react-icons/hi";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthModel from "../Components/AuthModel.jsx";
import hrImg from "../assets/HR.png"
import techImg from "../assets/tech.png"
import confidenceImg from "../assets/confi.png"
import creditImg from "../assets/credit.png"
import evalImg from "../assets/ai-ans.png"
import resumeImg from "../assets/resume.png"
import pdfImg from "../assets/pdf.png"
import analyticsImg from "../assets/history.png"
import Footer from "../Components/Footer.jsx";


function Home() {
    const { userData } = useSelector((state => state.user))
    const [showAuth, setShowAuth] = useState(false)
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-[#f3f3f3] flex flex-col">
            <NavBar />
            <div className="flex-1 px-6 py-10">
                <div className="mx-auto max-w-5xl">
                    <motion.div
                        initial={{ opacity: 0, x: 60 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1.5 }}
                        className="flex justify-center mb-6">
                        <div className="bg-gray-100 text-gray-600 text-sm px-4 py-6 rounded-full flex items-center gap-2">
                            <HiSparkles size={16} className="bg-green-50 text-green-600" />
                            AI Powerd Smart Interwivw Platform
                        </div>
                    </motion.div>
                    <div className="mb-28 text-center">
                        <motion.h1
                            initial={{ opacity: 0, x: -150 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1.5 }}
                            className="text-4xl md:text-6xl font-semibold leading-tight max-w-4xl mx-auto">
                            Practice Interviews With
                            <span
                                className="relative inline-block">
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 3 }}
                                    className="bg-green-100 text-green-600 px-5 py-1 rounded-full">
                                    AI Intelligens
                                </motion.span>
                            </span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, x: 250 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1.3 }}
                            className="mt-6 text-gray-500 max-w-2xl mx-auto text-lg">
                            Role-based mock Interviews wit smart follow-ups, adaptive difficulty and real-time performance evaluation.
                        </motion.p>
                        <div className="flex flex-wrap justify-center gap-4 mt-10">
                            <motion.button
                                onClick={() => {
                                    if (!userData) {
                                        setShowAuth(true)
                                        return;
                                    }
                                    navigate("/interview")
                                }}
                                initial={{ opacity: 0, x: 150 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 1 }}
                                whileHover={{ opacity: 0.9, scale: 1.05 }}
                                whileTap={{ opacity: 1, scale: 0.95 }}
                                className="bg-black text-white px-10 py-3 rounded-full hover:opacity-90 transition shadow-md">
                                Start Interview
                            </motion.button>
                            <motion.button
                                onClick={() => {
                                    if (!userData) {
                                        setShowAuth(true)
                                        return;
                                    }
                                    navigate("/history")
                                }}
                                initial={{ opacity: 0, x: -1000 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 1.7, delay: 1.5 }}
                                whileHover={{ opacity: 0.9, scale: 1.05 }}
                                whileTap={{ opacity: 1, scale: 0.95 }}
                                className="border border-gray-300 px-10 py-3 rounded-full hover:bg-gray-100 transition">
                                View History
                            </motion.button>
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, x: -380 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1.5 }}
                        className="flex flex-col md:flex-row justify-center items-center gap-10 mb-28">
                        {
                            [
                                {
                                    icon: <BsRobot size={24} />,
                                    step: "STEP 1",
                                    title: "Role & Experience Selection",
                                    desc: "AI adjust difficulty based on selected job role."
                                },
                                {
                                    icon: <BsMic size={24} />,
                                    step: "STEP 2",
                                    title: "Smart Voice Interview",
                                    desc: "Dynamic follow-up questions based on your answers."
                                },
                                {
                                    icon: <BsClock size={24} />,
                                    step: "STEP 3",
                                    title: "Timer Based Simulation",
                                    desc: "Real Interview pressure with time tracking."
                                }
                            ].map((item, index) => (
                                <motion.div
                                    whileHover={{ scale: 1.2 }}
                                    whileTap={{ scale: 0.95 }}
                                    key={index} className="bg-white relative rounded-3xl border-2 border-green-100 hover:border-green-500 p-10 w-80 max-w-[90%] shadow-md hover:shadow-2xl transition-all duration-300">
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white border-2 border-green-500 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg">{item.icon}</div>
                                    <div className="pt-10 text-center">
                                        <div className="mb-2 text-xs text-green-600 font-semibold tracking-wide">{item.step}</div>
                                        <h3 className="text-lg mb-3 font-semibold">{item.title}</h3>
                                        <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                                    </div>
                                </motion.div>
                            ))
                        }
                    </motion.div>

                    <div className="mb-32">
                        <motion.h2
                            initial={{ opacity: 0, y: 70 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.94 }}
                            className="mb-16 text-4xl font-semibold text-center">
                            Advance Ai {" "}
                            <span className="text-green-600">Capabilitis</span>
                        </motion.h2>

                        <div className="grid md:grid-cols-2 gap-10">
                            {
                                [
                                    {
                                        image: evalImg,
                                        icon: <BsBarChart size={20} />,
                                        title: "AI Answer Evaluation",
                                        desc: "Score communication, technical accuracy, and confidence."
                                    },
                                    {
                                        image: resumeImg,
                                        icon: <BsFileEarmarkText size={20} />,
                                        title: "Resume Based Interview",
                                        desc: "Project-specific questions based on your resume."
                                    },
                                    {
                                        image: pdfImg,
                                        icon: <BsFileEarmarkText size={20} />,
                                        title: "Downloadable PDF Report",
                                        desc: "Detailed strengths, weaknesses, and improvment insights."
                                    },
                                    {
                                        image: analyticsImg,
                                        icon: <BsBarChart size={20} />,
                                        title: "History & Analytics",
                                        desc: "Track progress with performance graphs and topic analysis."
                                    }
                                ].map((item, index) => (
                                    <motion.div key={index}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 1, delay: index * 0.3 }}
                                        whileHover={{ scale: 1.03 }}
                                        className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all">

                                        <div className="flex flex-col md:flex-row items-center gap-8">
                                            <div className="w-full md:w-1/2 flex justify-center">
                                                <img src={item.image} alt={item.title} className="w-full h-auto object-contain max-h-64" />
                                            </div>

                                            <div className="w-full md:w-1/2">
                                                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-6">
                                                    {item.icon}
                                                </div>
                                                <h3 className="mb-3 font-semibold text-xl">{item.title}</h3>
                                                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                                            </div>
                                        </div>

                                    </motion.div>
                                ))
                            }
                        </div>

                    </div>

                    <div className="mb-32">
                        <motion.h2
                            initial={{ opacity: 0, y: 70 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.94 }}
                            className="mb-16 text-4xl font-semibold text-center">
                            Multiple Interview {" "}
                            <span className="text-green-600">Modes</span>
                        </motion.h2>

                        <div className="grid md:grid-cols-2 gap-10">
                            {
                                [
                                    {
                                        img: hrImg,
                                        title: "Hr Interview Mode",
                                        desc: "Behavioral and communication based evaluations."
                                    },
                                    {
                                        img: techImg,
                                        title: "Technical Interview Mode",
                                        desc: "Deep technical questions based on selected role."
                                    },
                                    {
                                        img: confidenceImg,
                                        title: "Confidence Detection",
                                        desc: "Basic tone and voice analysis insights."
                                    },
                                    {
                                        img: creditImg,
                                        title: "Credit System.",
                                        desc: "Unlock premium Interview sessions easily."
                                    }
                                ].map((mode, index) => (
                                    <motion.div key={index}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.7, delay: 0.3 }}
                                        whileHover={{ y: -15 }}
                                        className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all">

                                        <div className="flex items-center justify-between gap-6">
                                            <div className="w-1/2">
                                                <h3 className="mb-3 text-xl font-semibold">{mode.title}</h3>
                                                <p className="text-sm text-gray-500 leading-relaxed">{mode.desc}</p>
                                            </div>
                                            <div className="w-1/2 flex justify-end">
                                                <img
                                                    src={mode.img}
                                                    alt={mode.title}
                                                    className="w-28 h-28object-contain"
                                                />
                                            </div>
                                        </div>

                                    </motion.div>
                                ))
                            }
                        </div>

                    </div>

                </div>
            </div>
            {showAuth && <AuthModel onClose={() => setShowAuth(false)} />}

            <motion.div
                initial={{ opacity: 0, x: -60 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.7, delay: 0.3 }}
            >
                <Footer />
            </motion.div>

        </div>
    )
}

export default Home