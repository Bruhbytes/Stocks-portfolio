import { useState } from "react";
import { useEffect, useContext,createContext } from "react";
import axios from 'axios';

const AuthContext = createContext();

const AuthProvider = ({children}) => {
    //now auth can be accessed from anywhere
    const [auth, setAuth] = useState( { 
        user:null,
        token:""
    });

    // //default axios
    axios.defaults.headers.common["Authorization"] = auth?.token
    
    useEffect(() => {
        const data = localStorage.getItem('portauth');
        const email = localStorage.getItem('email');
        if(data) {
            const parsedData = JSON.parse(data);

            setAuth({               
                token:parsedData,
                user: email
            });            

        }
        //eslint-disable-next-line
    },[]);

    return (
        <AuthContext.Provider value= {[auth,setAuth]}>
            {children}
        </AuthContext.Provider>
    )
}

const useAuth = () => useContext(AuthContext);
export {useAuth, AuthProvider}
