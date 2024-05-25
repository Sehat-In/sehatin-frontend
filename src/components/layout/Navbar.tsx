"use client";

import { useRouter } from "next/navigation";
import { useUserContext } from "../context/UserContext";
import { useEffect, useState } from "react";
import { Spinner } from '@chakra-ui/react'
import axios from "axios";
import Notifications from "@/modules/notifications/Notification";

const Navbar = () => {
    const {userData, loading, isAuthenticated, logout} = useUserContext();
    const [notification, setNotification] = useState(false);
    
    useEffect(()=>{
        axios.get(process.env.NEXT_PUBLIC_API_URL + '/api/v1/posts/check-notification/' + userData.username)
            .then((res)=>{
                setNotification(true);
            })
            .catch((err)=>{
                console.log(err);
                setNotification(false);
            })
    }, [loading])

    const router = useRouter();

    const handleLogin = () => {
        router.push('/login');
    }

    const handleLogout = () => {
        logout();
    }

    return (
        <>
            <div className="navbar bg-base-100" style={{backgroundColor: "grey"}} >
                <div className="flex-1">
                    <a className="btn btn-ghost text-xl">Sehat-In</a>
                </div>
                <div className="flex-none" style={{gap: 10}}>
                    {!isAuthenticated ? <></> : notification ? 
                    <Notifications color='red' username={userData.username}/> :
                    <Notifications color='gray' username={userData.username}/>}
                    <ul className="menu menu-horizontal px-1" style={{alignItems: 'center'}}>
                        <li>
                            {loading ? <div><Spinner color='green.300' /></div> : 
                            (isAuthenticated ? <button className="btn" onClick={handleLogout}>Logout</button>:<button className="btn" onClick={handleLogin}>Login</button>)}
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
}

export default Navbar;