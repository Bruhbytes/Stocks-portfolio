import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import axios from "axios";

export const useLogin = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsloading] = useState(null);
    const {dispatch} = useAuthContext();

    const login = async (email, password) => {
        setError(null);
        setIsloading(true);

        // const response = await fetch('/login', {
        //     method: "POST",
        //     headers: {'Content-Type': 'application/json'},
        //     body: JSON.stringify({username, password})
        // })
        // const json = await response.json();
        axios.post(
            "http://localhost:4000/api/login",
            {
              email,
              password,
            },
            { headers: { "Content-Type": "application/json" } }
          )
          .then(response => {
            if(response.status === 200){
                // save the user to local storage
               localStorage.setItem('user', JSON.stringify(response.data));
   
               // update the auth context
               dispatch({type: 'LOGIN', payload: response.data});
   
               // update loading state
               setIsloading(false);
           }
          })
          .catch(error => {
            setError(error.response.data);
            setIsloading(false);            
          });       
    }

    return {login, isLoading, error};
}