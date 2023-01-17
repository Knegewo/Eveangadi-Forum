import React, { useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import UserContext from '../../context/UserContext';
// import Login from '../Login/Login';

const Home = ({ logout }) => {
    const [userData, setUserData] = useContext(UserContext);
    const navigate = useNavigate();

    //if there is no user data navigate to the login page. Useeffect will check user data and reroute to the page
    useEffect(() => {
        if (!userData.user) navigate("/login");
    }, [userData.user, navigate]);
  return (
    <div>
       
        {/* show username in homepage */}
        <h1>Welcome {userData.user?.display_name}</h1>

        {/* logout when the button clicked in which the function comes from app.js */}
        <button onClick={logout}>Log out</button>
    </div>
  )
}

export default Home

