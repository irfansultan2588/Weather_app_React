import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './Compoenets/Navbar';
import Home from './Compoenets/Home';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from './Compoenets/Login';
import Logout from './Compoenets/Logout';
import Signup from './Compoenets/Signup';
import Profile from './Compoenets/Profile';
import React, { useEffect, useContext } from 'react'
import { GlobalContext } from './Context';
import axios from 'axios';
import loddingimage from './assets/loading-1.webp'



function App() {

  let { state, dispatch } = useContext(GlobalContext);


  useEffect(() => {


    const getProfile = async () => {

      let baseUrl = "https://odd-lime-termite-tie.cyclic.app";

      try {
        let response = await axios({
          url: `${baseUrl}/profile`,
          method: "get",
          withCredentials: true
        })
        if (response.status === 200) {
          console.log("response: ", response.data);
          dispatch({
            type: "USER_LOGIN",
            payload: response.data
          })

        } else {
          dispatch({
            type: "USER_LOGOUT"
          })
        }

      } catch (e) {
        console.log("Error in api", e);
        dispatch({
          type: "USER_LOGOUT"
        })
      }
    }


    getProfile();


  }, [])





  return (
    <Router>
      <Navbar />



      <Routes>

        {(state.isLogin === true) ?

          <>

            <Route path="*" element={<Navigate to="/" />} />
            <Route path="/" element={<Home />} />
            <Route path="/Profile" element={<Profile />} />
            <Route path="/logout" element={<Logout />} />
          </>
          :
          null
        }

        {(state.isLogin === false) ?

          <>
            <Route path="/Login" element={<Login />} />
            <Route path="/Signup" element={<Signup />} />
            <Route path="*" element={<Navigate to="/login" />} />

          </>
          :
          null
        }


        {(state.isLogin === null) ?

          <>
            <Route path="*" element={
              <div className='image_container234'>
                <img src={loddingimage} alt='loding_image' />
              </div>
            } />


          </>
          :
          null
        }

      </Routes>

    </Router >

  );
}

export default App;
