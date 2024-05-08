"use client";

import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function LoginHandler() {
    const searchParams = useSearchParams();
;   const search = searchParams.get('key')
    console.log(search)
    return <>
    <h1>Logging in...</h1>
    </>;
}
