import axios from "axios"
import { BsRobot } from "react-icons/bs"
import { IoSparklesOutline } from "react-icons/io5"
import { FcGoogle } from "react-icons/fc"
import { motion } from "motion/react"
import { signInWithPopup } from "firebase/auth"
import { auth, provider } from "../Utils/firebase"
import { serverUrl } from "../App"
import { useDispatch } from "react-redux"
import { setUserData } from "../Redux/userSlice"

function Auth({isModel = false}) {

  const dispatch = useDispatch();

  const handleGoogleAuth = async () => {
    try {
      const response = await signInWithPopup(auth, provider);
      // console.log(response);
      let User = response.user;
      let name = User.displayName;
      let email = User.email;
      const result = await axios.post(serverUrl + "/api/auth/googleAuth",
        { name, email }, { withCredentials: true });
        dispatch(setUserData(result.data));
        // console.log(result.data);
    }
    catch (error) {
      dispatch(setUserData(null));
      console.log(error)
    }
  }

  return (
    <div className="w-full min-h-screen bg-[#f3f3f3] flex items-center justify-center px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: -600 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5 }}
        className="w-full max-w-md p-8 rounded-3xl bg-white border border-gray-200 shadow-2xl flex flex-col items-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="bg-black text-white p-2 rounded-lg">
            <BsRobot size={18} />
          </div>
          <h2 className="text-lg font-semibold">NeuroHire</h2>
        </div>
        <h1 className="text-2xl md:text-3xl font-semibold text-center leading-snug mb-4">
          continue with {" "} <span className="bg-green-100 text-green-600 px-4 py-1 mt-0.5 rounded-full inline-flex items-center gap-2"><IoSparklesOutline size={16} />NeuroHire AI</span>
        </h1>
        <p className="text-gray-500 text-center text-sm md:text-base leading-relaxed mb-8">
          <span className="font-semibold">NeuroHire AI Interview</span> is a platform that helps you prepare for your interviews by providing feedback on your answers.
        </p>
        <motion.button
          onClick={handleGoogleAuth}
          whileHover={{ opacity: 0.9, scale: 1.05 }}
          whileTap={{ opacity: 1, scale: 0.95 }}
          className="bg-black text-white px-6 py-2 cursor-pointer rounded-full w-[80%] flex items-center justify-center gap-2">
          <FcGoogle size={20} />
          <span>Continue with Google</span>
        </motion.button>
      </motion.div>
    </div>
  )
}

export default Auth
