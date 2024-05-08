"use client";

import axios from "axios";
import { useEffect } from "react";

export default function LoginHandler() {
    const handleLogin = async () => {
        await axios
            .post(process.env.NEXT_PUBLIC_API_URL + "/api/v1/auth/dummy")
            .then(async (response) => {
            });
        await axios
            .get('/api')
            .then((response)=>{
                console.log(response);
            })
    };

    useEffect(() => {
        handleLogin();
    }, []);
    return <></>;
}
