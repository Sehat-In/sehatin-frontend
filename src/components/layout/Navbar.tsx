"use client";

import { useRouter } from "next/navigation";
import { useUserContext } from "../context/UserContext";
import { useEffect } from "react";
import { CircularProgress } from "@chakra-ui/react";


const Navbar = () => {
    const {loading, isAuthenticated, logout} = useUserContext();

    useEffect(()=>{
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
                <div className="flex-none">
                    <ul className="menu menu-horizontal px-1" style={{alignItems: 'center'}}>
                        <li>
                            {loading ? <div><CircularProgress isIndeterminate color='green.300' /></div> : 
                            (isAuthenticated ? <button className="btn" onClick={handleLogout}>Logout</button>:<button className="btn" onClick={handleLogin}>Login</button>)}
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
}

export default Navbar;