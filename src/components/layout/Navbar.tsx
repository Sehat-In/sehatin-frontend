"use client";

import { useRouter } from "next/navigation";
import { useUserContext } from "../context/UserContext";
import { useEffect, useState } from "react";
import { Button, Icon } from "@chakra-ui/react";
import { Spinner } from '@chakra-ui/react'
import { BellIcon } from "@chakra-ui/icons";
import { IconButton } from '@chakra-ui/react'
import axios from "axios";


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
                    {isAuthenticated ? <></> : notification ? 
                    <IconButton aria-label="notification-button" boxSize={7} isRound={true} variant='solid' colorScheme='red' icon={<Icon as={BellIcon} boxSize={5}/>} onClick={handleLogin} /> :
                    <IconButton aria-label="notification-button" boxSize={7} isRound={true} variant='solid' colorScheme='gray' icon={<Icon as={BellIcon} boxSize={5}/>} onClick={handleLogin} />}
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