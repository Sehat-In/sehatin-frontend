"use client";

import { useUserContext } from "@/components/context/UserContext";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { use, useEffect } from "react";

export default function LoginHandler() {
    const {isAuthenticated} = useUserContext();
    const searchParams = useSearchParams();
    const router = useRouter();
    useEffect(() => {
        const search = searchParams.get('key') || 'ga ada';
        if(isAuthenticated) router.push('/');
        axios.get(process.env.NEXT_PUBLIC_API_URL + '/api/v1/auth/get-data-from-token', {
            headers: {
                Authorization: `Bearer ${search}`
            }
        })
            .then((response)=>{
                localStorage.setItem('user', JSON.stringify(response.data));
                window.location.href = '/';
            })
    }, [searchParams]);
    return <>
        <h1>Logging in...</h1>
    </>;
}
