import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Auth from './pages/Auth'
import { useEffect } from 'react'
import axios from 'axios'
import { serverUrl } from './config.js'
import { useDispatch } from 'react-redux'
import { clearUserData, setUserData } from './redux/userSlice.js'

const App = () => {

  const dispatch = useDispatch();

  
  useEffect(() => {
    const getuser = async () => {
      try{

        const res = await axios.get(serverUrl + "/api/user/currentUser", {withCredentials: true});
        // ApiResponse stores the authenticated user inside its data field.
        dispatch(setUserData(res.data.data));

      }catch(error){
        if (error.response?.status !== 401) {
          console.error("Unable to fetch current user", error);
        }
        dispatch(clearUserData());
      }
    }

    getuser();
  }, [dispatch])

  
  return (
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/auth" element={<Auth/>}/>
    </Routes>
  )
}

export default App
