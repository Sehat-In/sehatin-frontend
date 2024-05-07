"use client";

import axios from "axios";
import { useEffect } from "react";

export default function LoginHandler() {
    useEffect(() => {
        axios
            .get(process.env.NEXT_PUBLIC_API_URL + "/api/v1/auth/dummy")
            .then((response) => {
                axios
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
    }, []);
    return <></>;
}
