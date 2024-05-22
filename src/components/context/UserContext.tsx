"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { useContext } from "react";

export interface UserData{
    id: number;
    username: string;
    email: string;
    accountType: string;
    profile: {
        id: number;
        userId: number;
        firstName: string;
        lastName: string;
        picture: string;
    }
    accessToken: string;
    refreshToken: string;
}

export interface User{
    userData: UserData;
    loading: boolean;
    isAuthenticated: boolean;
    login: (query:any)=>Promise<void>;
    logout: ()=>void;
}

export const UserContext = React.createContext<User>({} as User);

export const useUserContext = () => useContext(UserContext);

export const UserContextProvider: React.FC<any> = ({ children }:any) => {
    const [userData, setUserData] = useState<UserData>({} as UserData);
    const [loading, setLoading] = useState<boolean>(true);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);


    const login = async (query:any) => {
        await axios.post(process.env.NEXT_PUBLIC_API_URL + '/api/v1/auth/login', {
            username: query.username,
            password: query.password
        })
        .then((response)=>{
            setUserData(response.data);
            localStorage.setItem('user', JSON.stringify(response.data));
            window.location.href = '/';
        })
        .catch((error)=>{
            console.log(error);
        })
    }

    const logout = () => {
        localStorage.removeItem('user');
        window.location.href = '/';
    }

    const refresh = async (query:UserData) => {
        await axios.get(process.env.NEXT_PUBLIC_API_URL + '/api/v1/auth/refresh', {
            headers: {
                Authorization: `Bearer ${query.refreshToken}`
            }
        })
        .then((response)=>{
            query.accessToken = response.data.accessToken;
            query.refreshToken = response.data.refreshToken;
            localStorage.removeItem('user');
            localStorage.setItem('user', JSON.stringify(query));
            setUserData(query);
            setIsAuthenticated(true);
            setLoading(false);
        })
        .catch((error)=>{
            localStorage.removeItem('user');
            setLoading(false);
        })
    }

    useEffect(() => {
        const user = localStorage.getItem('user');
        if(user){
            const data:UserData = JSON.parse(user);
            refresh(data);
        }
        else{
            setLoading(false);
        }
    }, []);

    return (
    <>
        <UserContext.Provider value={{userData: userData, loading, isAuthenticated, login, logout}}>
            {children}
        </UserContext.Provider>
    </>)
}