import React, { createContext, useState } from "react";
import { useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({children}) =>{
  const [user, setUser] = useState(null);
   const [loading, setLoading] = useState(true);
  useEffect(() => {
    const utilizatorSalvat = localStorage.getItem("user");
    if(utilizatorSalvat) {
      setUser(JSON.parse(utilizatorSalvat));
    }
    setLoading(false);
  },[])

  return (
    <UserContext.Provider
      value = {{
        user,
        setUser,
        loading
      }}>
        {children}
      </UserContext.Provider>
  );
};