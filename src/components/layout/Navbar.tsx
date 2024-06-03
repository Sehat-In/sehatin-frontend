"use client";

import { useRouter } from "next/navigation";
import { useUserContext } from "../context/UserContext";
import { useEffect, useState } from "react";
import { Avatar, Button, Menu, MenuButton, MenuItem, MenuList, Spinner } from '@chakra-ui/react'
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

    const handleGoToProgress = () => {
        router.push('/progress');
    }

    const handleGoToForum = () => {
        router.push('/forum');
    }

    return (
        <>
            <div className="navbar bg-base-100" style={{backgroundColor: "teal"}} >
                <div className="flex-1">
                    <a className="btn btn-ghost text-xl" href="/" style={{ color: "white" }}>Sehat-In</a>
                </div>
                <div className="flex-none" style={{gap: 10}}>
                    {!isAuthenticated ? <></> : <Button onClick={handleGoToProgress}>Progress</Button>}
                    {!isAuthenticated ? <></> : <Button onClick={handleGoToForum}>Forum</Button>}
                    {!isAuthenticated ? <></> : notification ? 
                    <Notifications color='red' username={userData.username}/> :
                    <Notifications color='gray' username={userData.username}/>}
                    <ul className="menu menu-horizontal px-1" style={{alignItems: 'center'}}>
                        <li>
                            {loading ? <div><Spinner color='green.300' /></div> : 
                            (isAuthenticated ? <Menu>
                                <MenuButton as={Button} rounded={"full"} variant={"link"} cursor={"pointer"} minW={0}>  
                                  <Avatar src={userData.profile.picture}/>
                                </MenuButton>
                                
                                <MenuList border={5}>
                                    <MenuItem>
                                        <Button backgroundColor={'red'} color={'white'} width={'100%'} onClick={handleLogout}>Logout</Button>
                                    </MenuItem>
                                </MenuList>
                              </Menu>:
                            <Button onClick={handleLogin}>Login</Button>)}
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
}

export default Navbar;