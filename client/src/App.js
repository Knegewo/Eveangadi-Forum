import axios from 'axios';
import { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { UserContext } from './context/UserContext';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import SignUp from './pages/SignUp/SignUp';

function App() {
  const [userData, setUserData] = useContext(UserContext);

  const checkLoggedIn = async () => {

    //check if token already exists in localStorage
    let token = localStorage.getItem('auth-token');
    if (token === null) {

      //token not in localStorage then set auth token empty
      localStorage.setItem('auth-token', '');
      token = '';
    } else {

      //if token exists in localStorage then use auth to verify token and get user info
      const userRes = await axios.get('http://localhost:4000/api/users', {
        headers: { 'x-auth-token': token }
      });

           //set the global state with user info
           setUserData({
            token,
            user: {
              id: userRes.data.data.user_id,
              display_name: userRes.data.data.user_name
            }
          })
        }
      }
    
      const logout = () => {

        //set global state to undefined will logout the user
        setUserData({
          token: undefined,
          user: undefined,
        });
    
        //resetting localStorage 
        localStorage.setItem('auth-token', '');
      };
    
      useEffect(() => {
        //check if the user is logged in or not
        checkLoggedIn();
      }, []);
      return (
        <Router>
          <div className='app'>
            <Routes>
              <Route path="/signup" element={<SignUp />} />
              <Route path="/login" element={<Login />} />
    
              {/* passing logout function as props to Home page */}
              <Route path="/" element={<Home logout={logout} />} />
            </Routes>
          </div>
        </Router>
      );
    }
    

export default App;
