import React, { useState } from "react";
import api from "../utils/axios";   


export const AuthContext = React.createContext();


export const AuthProvider = ({children}) =>{
    const [user,setUser] = React.useState(null);
    const [loading, setLoading] = useState(true);

    React.useEffect(() =>{
        const storedUser = localStorage.getItem("user");
        if(storedUser){
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    },[]);

    const login = async (email,password) => {
        try{
            const {data} = await api.post('/auth/login',{email,password});
            setUser(data);
            localStorage.setItem("user",JSON.stringify(data));
            localStorage.setItem("token",data.token);
            return data;
        }
        catch(err){
            console.error("Login failed:",err);
            throw {
                message:
                    err.response?.data?.message ||
                    err.response?.data?.error ||
                    "Login failed",

                needsVerification:
                    err.response?.data?.needsVerification || false
            };
        }
    };
    const verifyOtp = async (email, otp) => {
        try {
            const { data } = await api.post("/auth/verify-otp", {
                email,
                otp
            });

            setUser(data);

            localStorage.setItem("user", JSON.stringify(data));
            localStorage.setItem("token", data.token);

            return data;
        } catch (err) {
            
            console.error("Otp Verification failed:",err);
            throw {
                message:
                    err.response?.data?.message ||
                    err.response?.data?.error ||
                    "OTP verification failed"

                
            };
        }
    };
    const logout = () =>{
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("userInfo");
        localStorage.removeItem("token");
    }

    const register = async (name,email,password) =>{
        try{
            const {data} = await api.post('/auth/register',{name,email,password});
            return data;
        }
        catch(error){
            throw error.response?.data?.message ||error.response?.data?.message ||'Registration Failed';
        }
    }

    return (
        <AuthContext.Provider value={{user,loading,login,logout,verifyOtp,register}}>  
            {children}
        </AuthContext.Provider>
    )
}