import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";   // PDF read/parse karne ki library hai Resume (PDF) ka text extract karne ke liye

import { askAi } from "../services/openRouter.service.js"
import User from "../models/user.model.js"
import Interview from "../models/interview.model.js"


export const analyzeResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Please upload a Resume" });
        }

        const filePath = req.file.path

        const fileBuffer = await fs.promises.readFile(filePath)  // file ko buffer me convert krenge ya keh sakte hai file ko binary me convert krenge
        const unit8Array = new Uint8Array(fileBuffer)  // buffer ko Uint8Array me convert ksr rhs hsi kyuki pdfjs directly Buffer nahi samajhta

        const pdf = await pdfjsLib.getDocument({ data: unit8Array }).promise

        let resumeText = " ";   // Resume ke sare text ko extract krenge or isme store krenge

        // Iterate through each page of the PDF
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {   // for loop tab tak chalega jitne uploaded pdf me page honge
            const page = await pdf.getPage(pageNum);   // page ko extract krenge
            const content = await page.getTextContent();  // page ke text ko extract krenge ya page ke andar ke text ko nikalenga os content me store kar rhe hai 

            const pageText = content.items.map((item) => item.str).join(" ");  // page ke text ko string me convert krenge
            resumeText += pageText + "\n";  // page ke text ko resumeText me store krenge
        }

        resumeText = resumeText.replace(/\s+/g, " ").trim();  // resumeText me extra spaces / line breaks / tabs hain → sabko ek single space " " me convert karne ke liye
        // console.log(resumeText)


        // Ab resumeText ke data ko AI ko ek messege ki tarha denge or sath me ek prompt bhi add karna hai.

        const messages = [
            {
                role: "system",
                content: `
            Extract stuctured data from the resume.

            Return strictly JSON: 
            {
            "role": "string",
            "experience": "string",
            "projects": ["project1", "project2"],
            "skills": ["skill1", "skill2"]
            }
            `
            },
            {
                role: "user",
                content: resumeText
            }
        ];

        const aiResponse = await askAi(messages)
        // console.log("aiResponse is => ", aiResponse);

        const parse = JSON.parse(aiResponse);

        // console.log("aiResponse after JSON.parse is => ", parse);

        fs.unlinkSync(filePath)

        res.json({
            role: parse.role,
            experience: parse.experience,
            projects: parse.projects,
            skills: parse.skills,
            resumeText
        });
    } catch (error) {
        console.log("Error in analyzeResume => ", error);

        if (req.file && fs.existsSync(req.file.path)) {  // file ko delete krenge agar pehle delete nhi hui ya analize me error aaya to pehle detele nhi hogi. isliye yha karwa rhe hai
            fs.unlinkSync(req.file.path);
        }
        return res.status(500).json({ message: `Analyze Resume Failed ${error.message}` })
    }
};



export const generateQuestions = async (req, res) => {
    try {
        let { role, experience, mode, resumeText, projects, skills } = req.body

        role = role?.trim();
        experience = experience?.trim();
        mode = mode?.trim();

        if (!role || !experience || !mode) {
            return res.status(400).json({ message: "Role, Experience and Mode are required" });
        }

        const user = await User.findById(req.userId)
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.credits < 50) {
            return res.status(400).json({ message: "Not enough credits. Minimum 50 credits required" });
        }

        const projectText = Array.isArray(projects) && projects.length ? projects.join(", ") : "None";

        const skillText = Array.isArray(skills) && skills.length ? skills.join(", ") : "None";

        const safeResume = resumeText?.trim() || "None";

        const userPrompt = `
        Role:${role}
        Experience:${experience}
        InterviewMode:${mode}
        Projects:${projectText}
        Skills:${skillText}
        Resume:${safeResume}
        `;

        if (!userPrompt.trim()) {
            return res.status(400).json({ message: "Prompt content is empty" });
        }

        const messages = [

            {
                role: "system",
                content: `
You are a real human interviewer conducting a professional interview.

Speak in simple, natural English as if you are directly talking to the candidate.

Generate exactly 7 interview questions.

Strict Rules:
- Each question must contain between 10 and 35 words.
- Each question must be a single complete sentence.
- Do NOT number them.
- Do NOT add explanations.
- Do NOT add extra text before or after.
- One question per line only.
- Keep language simple and conversational.
- Questions must feel practical and realistic.

Difficulty progression:
Question 1 → easy
Question 2 → easy
Question 3 → medium
Question 4 → medium
Question 5 → medium
Question 6 → hard
Question 7 → hard

Make questions based on the candidate’s role, projects, skills, programming languages, technologies, and resume details.

IMPORTANT TECHNICAL INTERVIEW RULES:
If interviewMode is "technical":
- Ask ONLY technical questions.
- Focus mainly on the candidate's listed skills, technologies, frameworks, tools, databases, and programming languages.
- Ask concept-based, problem-solving, debugging, optimization, API, database, authentication, state management, project architecture, and coding-related questions.
- Questions should test practical technical knowledge.
- Prefer questions related to projects mentioned in the resume.
- Do NOT ask HR, behavioral, personality, teamwork, leadership, strengths, weaknesses, or career-goal questions.
- Do NOT ask generic experience-based questions unless directly connected to technical implementation.

IMPORTANT HR INTERVIEW RULES:
If interviewMode is "HR":
- Ask questions about communication, teamwork, challenges, career goals, work experience, project responsibilities, strengths, weaknesses, and professional situations.
- Avoid deep technical concept questions.
`
            }
            ,
            {
                role: "user",
                content: userPrompt
            }
        ];

        const aiResponse = await askAi(messages)   // uper jo messages naam ke array me prompt likha hai woh wala messages variable pass kar rhe hai yha 

        if (!aiResponse || !aiResponse.trim()) {
            return res.status(400).json({ message: "AI returned empty response." });
        }

        const questionsArray = aiResponse
            .split("\n")
            .map(q => q.trim())
            .filter(q => q.length > 0)
            .slice(0, 7);

        if (questionsArray.length === 0) {
            return res.status(400).json({ message: "AI Failed to generate questions." });
        }


        user.credits -= 50;
        await user.save();

        const interview = await Interview.create({
            userId: user._id,
            role,
            experience,
            mode,
            resumeText: safeResume,
            questions: questionsArray.map((q, index) => ({
                question: q,
                difficulty: ["easy", "easy", "medium", "medium", "medium", "hard", "hard"][index],
                timeLimit: [60, 60, 90, 90, 90, 120, 120][index],
            }))
        });

        res.json({
            interviewId: interview._id,
            creditsLeft: user.credits,
            userName: user.name,
            questions: interview.questions
        })

    } catch (error) {
        console.log("Error in generateQuestions:", error);
        return res.status(500).json({ message: `Failed to create interview ${error.message}` })
    }
}



export const submitAnswer = async (req, res) => {
    try {
        const { interviewId, questionIndex, answer, timeTaken } = req.body

        const interview = await Interview.findById(interviewId)
        if (!interview) {
            return res.status(404).json({ message: "Interview not found" })
        }

        const question = interview.questions[questionIndex]
        if (!question) {
            return res.status(404).json({ message: "Question not found" })
        }

        // if No Answer
        if (!answer) {
            question.score = 0;
            question.feedback = "You did not answer the question.";
            question.answer = "";

            await interview.save()

            return res.json({
                feedback: question.feedback
            });
        }

        // If Time limit is complete But No Answer submitted
        if (timeTaken >= question.timeLimit) {
            question.score = 0;
            question.feedback = "You did not answer the question in time limit.";
            question.answer = "";

            await interview.save();

            return res.json({
                feedback: question.feedback
            });
        }

        const messages = [
            {
                role: "system",
                content: `
You are a professional human interviewer evaluating a candidate's answer in a real interview.

Evaluate naturally and fairly, like a real person would.

Score the answer in these areas (0 to 10):

1. Confidence – Does the candidate show confidence in their answer?
2. Communication – Is the language clear, and easy to understand?
3. Correctness – Is the answer accurate, relevant, and complete?

Rules:
- Be realistic and unbiased.
- Do not give random scores.
- If the answer is weak, score low.
- If the answer is strong and detailed, score high.
- Consider clarity, structure, and relevance.

Calculate:
finalScore = average of confidence, communication, and correctness (rounded to nearest whole number).

Feedback Rules:
- Write natural human feedback.
- 15 to 60 words only.
- Sound like real interview feedback.
- Can suggest improvement if needed.
- Do NOT repeat the question.
- Do NOT explain scoring.
- Keep tone professional and honest.

Return ONLY valid JSON in this format:

{
  "communication": number,
  "confidence": number,
  "correctness": number,
  "finalScore": number,
  "feedback": "15-60 word human feedback"
}
`
            }
            ,
            {
                role: "user",
                content: `
Question: ${question.question}
Answer: ${answer}
`
            }
        ];


        const aiResponse = await askAi(messages)

        // console.log("AI RESPONSE At 311 line =>", aiResponse)

        const parsed = JSON.parse(aiResponse)

        question.answer = answer;
        question.confidence = parsed.confidence;
        question.communication = parsed.communication;
        question.correctness = parsed.correctness;
        question.score = parsed.finalScore;
        question.feedback = parsed.feedback;

        await interview.save();

        return res.status(200).json({
            feedback: parsed.feedback
        });
    } catch (error) {
        console.log("Error in submitAnswer:", error);
        return res.status(500).json({ message: `Submit Answer Failed ${error.message}` })
    }
}


export const finishInterview = async (req, res) => {
    try {
        const { interviewId } = req.body

        const interview = await Interview.findById(interviewId)
        if (!interview) {
            return res.status(404).json({ message: "Failed to find interview" })
        }

        const totalQuestions = interview.questions.length;

        let totalScore = 0;
        let totalConfidence = 0;
        let totalCommunication = 0;
        let totalCorrectness = 0;

        interview.questions.forEach((q) => {
            totalScore += (q.score) || 0;
            totalConfidence += (q.confidence) || 0;
            totalCommunication += (q.communication) || 0;
            totalCorrectness += (q.correctness) || 0;
        })

        const finalScore = totalQuestions ? totalScore / totalQuestions : 0;
        const avgConfidence = totalQuestions ? totalConfidence / totalQuestions : 0;
        const avgCommunication = totalQuestions ? totalCommunication / totalQuestions : 0;
        const avgCorrectness = totalQuestions ? totalCorrectness / totalQuestions : 0;

        interview.finalScore = finalScore;
        interview.status = "completed";

        await interview.save()

        return res.status(200).json({
            finalScore: Number(finalScore.toFixed(1)),
            confidence: Number(avgConfidence.toFixed(1)),
            communication: Number(avgCommunication.toFixed(1)),
            correctness: Number(avgCorrectness.toFixed(1)),
            questionWiseScore: interview.questions.map((q) => ({
                question: q.question,
                score: q.score || 0,
                feedback: q.feedback || "",
                confidence: q.confidence || 0,
                communication: q.communication || 0,
                correctness: q.correctness || 0
            }))
        });

    } catch (error) {
        console.log("Error in finishInterview", error);
        return res.status(500).json({ message: `Failed to finish interview ${error.message}` })
    }
}



export const getMyInterviews = async (req, res) => {
    try {
        const interviews = await Interview.find({ userId: req.userId })
            .sort({ createdAt: -1 })
            .select("role experience mode finalScore status createdAt");

        return res.status(200).json(interviews);

    } catch (error) {
        console.log("Error in getMyInterviews", error);
        return res.status(500).json({ message: `Failed to get currentUser interviews ${error.message}` })
    }
}


export const getInterviewReport = async (req, res) => {
    try {
        const interview = await Interview.findById(req.params.id)
        if (!interview) {
            return res.status(404).json({ message: "Interview not found" })
        }

        const totalQuestions = interview.questions.length;

        let totalConfidence = 0;
        let totalCommunication = 0;
        let totalCorrectness = 0;

        interview.questions.forEach((q) => {
            totalConfidence += (q.confidence) || 0;
            totalCommunication += (q.communication) || 0;
            totalCorrectness += (q.correctness) || 0;
        })

        const avgConfidence = totalQuestions ? totalConfidence / totalQuestions : 0;
        const avgCommunication = totalQuestions ? totalCommunication / totalQuestions : 0;
        const avgCorrectness = totalQuestions ? totalCorrectness / totalQuestions : 0;

        return res.json({
            // finalScore: interview.finalScore,
            finalScore: Number(interview.finalScore.toFixed(1)),
            confidence: Number(avgConfidence.toFixed(1)),
            communication: Number(avgCommunication.toFixed(1)),
            correctness: Number(avgCorrectness.toFixed(1)),
            questionWiseScore: interview.questions
        })

    } catch (error) {
        console.log("Error in getInterviewReport", error);
        return res.status(500).json({ message: `Failed to get interview report ${error.message}` })
    }
}