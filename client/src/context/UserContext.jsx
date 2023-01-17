import React, { createContext, useState } from 'react'
export const UserContext = createContext();
export const UserProvider = (props) => {

    const [userData, setUserData] = useState({  // it holds objects user and token, //login information(user info)
        user: undefined,
        token: undefined
    });
    //It holds globally define data, props childern will be avilable for under usercontext provider 
  return (
    <UserContext.Provider value={[userData, setUserData]}> 
         {props.children}
    </UserContext.Provider>
    
  )
}

export default UserContext