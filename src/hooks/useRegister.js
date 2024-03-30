import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import axios from "axios";

export const useRegister = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsloading] = useState(null);
    const {dispatch} = useAuthContext();

    const register = async (email, password) => {
        setError(null);
        setIsloading(true);

        const data = {
            email,
            password
        }        

        // axios.post(
        //     "http://localhost:4000/api/signup",
        //     data,
        //     { headers: { "Content-Type": "application/json" } }
        //   )
        //   .then(response => {
        //     console.log(response);
        //     if(response.status === 200){
        //         // save the user to local storage
        //        localStorage.setItem('user', JSON.stringify(response.data));
   
        //        // update the auth context
        //        dispatch({type: 'LOGIN', payload: response.data});
   
        //        // update loading state
        //        setIsloading(false);
        //    }
        //   })
        //   .catch(error => {
        //     // setError(error.response.data);
        //     console.log(error);
        //     setIsloading(false);            
        //   });  

        const response = await fetch('http://localhost:4000/api/signup', {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email, password})
        })
        const json = await response.json();

        if(!response.ok){
            setError(json.error);
            console.log(json.error);
            setIsloading(false);
        }
        if(response.ok){
             // save the user to local storage
            localStorage.setItem('user', JSON.stringify(json));

            // update the auth context
            dispatch({type: 'LOGIN', payload: json});

            // update loading state
            setIsloading(false);
        }

        

    }

    return {register, isLoading, error};
}