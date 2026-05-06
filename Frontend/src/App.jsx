import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Pages/Home.jsx'
import Auth from './Pages/Auth.jsx'
import InterviewPage from './Pages/InterviewPage.jsx'
import { useEffect } from 'react'
import axios from 'axios'
import { setUserData } from './Redux/userSlice.js'
import { useDispatch } from 'react-redux'

export const serverUrl = import.meta.env.VITE_SERVER_URL

function App() {

  const dispatch = useDispatch();

  useEffect(()=>{
    const getUser = async () => {
      try {
        const result = await axios.get(serverUrl + "/api/user/currentUser", 
          { withCredentials: true });
        dispatch(setUserData(result.data));
        // console.log(result.data);
      } catch (error) {
        dispatch(setUserData(null));
        console.log(error);
      }
    }
    getUser();
  },[dispatch])

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
      <Route path='/interview' element={<InterviewPage />} />
    </Routes>
    </BrowserRouter>
  )
}

export default App