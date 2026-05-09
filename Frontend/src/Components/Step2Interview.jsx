import React, { useEffect, useRef, useState } from 'react'
import maleVideo from '../assets/Videos/male-ai.mp4'
import femaleVideo from '../assets/Videos/female-ai.mp4'
import Timer from './Timer'
import { motion } from 'motion/react'
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa'

function Step2Interview({ interviewData, onFinish }) {

  const {interviewId, questions, userName} = interviewData
  const [isIntroPhase, setIsIntroPhase] = useState(true);

  const [isMicOn, setIsMicOn] = useState(true);
  const recognitionRef = useRef(null);
  const [isAIPlaying, setIsAIPlaying] = useState(false);

  const [corruntIndex, setCorruntIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [timeLeft, setTimeLeft] = useState(
    questions[0]?.timeLimit || 60
  );
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [voiceGender, setVoiceGender] = useState("female")
  const [subtitle, setSubtitle] = useState("");  

  const videoRef = useRef(null);

  const currentQuestion = questions[corruntIndex];


  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();  // voice ko load karne ke liye preDfine function
      if(!voices.length) return;

      // try known feamle voice first
      const femaleVoice = voices.find(v => 
        v.name.toLowerCase().includes("zira")  ||
        v.name.toLowerCase().includes("samantha") ||  
        v.name.toLowerCase().includes("female")
      );

      if (femaleVoice) {
        setSelectedVoice(femaleVoice);
        setVoiceGender("female");
        return;
    }

    // try known male voice
    const maleVoice = voices.find(v => 
      v.name.toLowerCase().includes("david") ||
      v.name.toLowerCase().includes("mark") ||
      v.name.toLowerCase().includes("male")
    );

    if (maleVoice) {
      setSelectedVoice(maleVoice);
      setVoiceGender("male");
      return;
    }

    // fallback: first voice (assum female)
    setSelectedVoice(voices[0]);
    setVoiceGender("female");
  }

  loadVoices(); 
  window.speechSynthesis.onvoiceschanged = loadVoices; // voice list update hone par reload karne ke liye event listener

  }, [])

  const videoSource = voiceGender === "male" ? maleVideo : femaleVideo;

  // SPEAK FUNCTION 

  const speakText = (text) => {
    return new Promise((resolve) => {
      if (!selectedVoice || !window.speechSynthesis) {
        resolve();
        return;
      }

      window.speechSynthesis.cancel();    // stop any ongoing speech

      //  add natural pause after comma and period for better flow
      const humanText = text
      .replace(/, /g, ", ... ")
      .replace(/\./g, ". ...");

      const utterance = new SpeechSynthesisUtterance(humanText);

      utterance.voice = selectedVoice;

      // Human like speaking rate and pitch
      utterance.rate = 0.92;   // slightly slower for clarity
      utterance.pitch = 1.05;   // slightly higher for warmth
      utterance.volume = 1;      // full volume

      utterance.onstart = () => {
        setIsAIPlaying(true);
        videoRef.current?.play();
      };

      utterance.onend = () => {
        videoRef.current?.pause();
        videoRef.current.currentTime = 0; // reset video to start
        setIsAIPlaying(false);


        setTimeout(() => {
          setSubtitle("");
          resolve();
        }, 300); // short delay after speech ends before resolving
      };

      setSubtitle(text); // set subtitle to current text
      window.speechSynthesis.speak(utterance);

    });
  }


    useEffect(() => {
      if (!selectedVoice) {
        return;
      }
      const runIntro = async () =>{
        if (isIntroPhase) {
          await speakText(
            `Hi ${userName}, it's great to meet you today. I hope you're feeling confident and ready.`
          )

            await speakText(
              "I'll ask you a few questions. just answer naturally, and take your time. Let's get started."
            )

            setIsIntroPhase(false);
        }else if (currentQuestion) {
          await new Promise(r => setTimeout(r, 800)); // short delay before next question

          // If Last Question (Level Hard) then give special prompt
          if (corruntIndex === questions.length - 1) {
            await speakText("Alright, this one migth be a more challenging.");
          }

          await speakText(currentQuestion.question);
        }
      }
      
      runIntro();

    }, [selectedVoice, isIntroPhase, corruntIndex])


    useEffect(() => {
      if (isIntroPhase) return;
      if (!currentQuestion) return;

      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);

    }, [isIntroPhase, corruntIndex])



    useEffect(() => {
      if(!("webkitSpeechRecognition" in window)) return;

      const recognition = new window.webkitSpeechRecognition();
      recognition.lang = "en-US";
      recognition.continuous = true;
      recognition.interimResults = false;

      recognition.onresult = (event) => {
        const transcript = 
        event.results[event.results.length - 1][0].transcript;

        setAnswer((prev) => prev + " " + transcript);
      };

      recognitionRef.current = recognition;
      
    }, [])




  return (
    <div className='min-h-screen bg-linear-to-br from-emerald-50 via-white to-teal-100 flex items-center justify-center p-4 sm:p-6'>
      <div className='w-full lg:w-[80%] max-w-350 min-h-[80vh] bg-white rounded-3xl shadow-2xl border border-gray-200 flex flex-col lg:flex-row overflow-hidden'>

        {/* video section  */}
        <div className='w-full lg:w-[35%] bg-white flex flex-col items-center p-6 space-y-6 border-r border-gray-200'>
          <div className='w-full max-w-md rounded-xl overflow-hidden shadow-xl'>
            <video src={videoSource}
            key={videoSource}
            ref={videoRef}
              muted
              playsInline
              preload='auto'
              className='w-full h-auto object-cover'
            />
          </div>

          {/* subtitle pending */}
          {subtitle && (
            <div className='w-full max-w-md bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm'>
              <p className='text-gray-700 text-sm sm:text-base font-medium text-center leading-relaxed'>{subtitle}</p>
            </div>
          )}


          {/* timer Area  */}
          <div className='w-full max-w-md bg-white border border-gray-200 rounded-xl shadow-md p-6 space-y-5'>
            <div className='flex items-center justify-between'>
              <span className='text-sm text-gray-500'>
                Interview Status
              </span>
              { isAIPlaying && <span className='text-sm font-semibold text-emerald-600'>
                {isAIPlaying ? "AI Speaking" : ""}
              </span>}
            </div>

            <div className='h-px bg-gray-200'></div>

            <div className='flex justify-center'>
              <Timer timeLeft={timeLeft} totalTime={currentQuestion?.timeLimit || 60 } />
            </div>

            <div className='h-px bg-gray-200'></div>

            <div className='grid grid-cols-2 gap-6 text-center'>
              <div>
                <span className='text-2xl font-bold text-emerald-600'>{corruntIndex + 1}</span>
                <span className='text-sm text-gray-400'>Current Question</span>
              </div>

              <div>
                <span className='text-2xl font-bold text-emerald-600'>{questions.length}</span>
                <span className='text-sm text-gray-400'>Total Questions</span>
              </div>
            </div>

          </div>

        </div>

        {/* Text Section  */}
        <div className='flex-1 flex flex-col p-4 sm:p-6 md:p-8 relative'>
        <h2 className='text-xl sm:text-2xl font-bold text-emerald-400 mb-6'>AI Smart Interview</h2>

         { !isIntroPhase && ( <div className='mb-6 relative bg-gray-50 p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-sm'>
            <p className='mb-2 text-xs sm:text-sm text-gray-400'>Question {corruntIndex + 1} of {questions.length}</p>

            <div className='text-base sm:text-lg font-semibold text-gray-800 leading-relaxed'>
              {currentQuestion?.question}
            </div>
          </div> )}
          <textarea
          onChange={(e)=>setAnswer(e.target.value)}
          value={answer}
           className='flex-1 p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none transition text-gray-700'
            placeholder='Type your answer here...' />
          <div className='mt-6 flex justify-center gap-4'>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              className='w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-black text-white shadow-lg' >
              <FaMicrophone size={20} />
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              className='flex-1 bg-gradient-to-r from-emerald-600 to-teal-500 text-white py-3 sm:py-4 rounded-2xl shadow-lg hover:opacity-90 transition font-semibold' >
              Submit Answer
            </motion.button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Step2Interview
