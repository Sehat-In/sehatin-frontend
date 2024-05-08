"use client";

import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function LoginHandler() {
    const searchParams = useSearchParams();
    const router = useRouter();
    useEffect(() => {
        const search = searchParams.get('key') || 'ga ada';
        axios.get(process.env.NEXT_PUBLIC_API_URL + '/api/v1/auth/get-data-from-token', {
            headers: {
                Authorization: `Bearer ${search}`
            }
        })
            .then((response)=>{
                localStorage.setItem('user', JSON.stringify(response.data));
                router.push('/');
            })
    }, [searchParams]);
    return <>
        <h1>Logging in...</h1>
    </>;
}
