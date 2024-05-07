"use client";

import axios from "axios";
import { useEffect } from "react";

export default function LoginHandler() {
    const handleLogin = async () => {
        await axios
            .get(process.env.NEXT_PUBLIC_API_URL + "/api/v1/auth/dummy")
            .then(async (response) => {
                await axios
                    .get("/api")
                    .then((response) => {
                        const user = JSON.parse(response.data.user);
                        localStorage.setItem("user", JSON.stringify(user));
                        window.location.href = "/";
                    })
                    .catch((error) => {
                        console.log(error);
                        window.location.href = "/login";
                    });
            });
    };

    useEffect(() => {
        handleLogin();
    }, []);
    return <></>;
}
