"use client";

import { useUserContext } from '@/components/context/UserContext';
import {
    FormControl,
    FormLabel,
    Input,
    Button,
    Flex,
} from '@chakra-ui/react'
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const LoginModule: any = () => {
    const router = useRouter();
    const {loading, isAuthenticated, login} = useUserContext();

    useEffect(()=>{
        if(!loading && isAuthenticated){
            router.push('/')
        }
    }, [loading])

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        await login({username, password})
    }
    const handleLoginWithGoogle = () => {
        window.location.href = process.env.NEXT_PUBLIC_API_URL + '/api/v1/auth/login-google';
    }

    return (
        <>
            <FormControl>
                <FormLabel>Username</FormLabel>
                <Input type='username' onChange={(action)=>setUsername(action.target.value)}/>

                <FormLabel py={5}>Password</FormLabel>
                <Input type='password' onChange={(action)=>setPassword(action.target.value)}/>

                <Flex gap={2} justify={'center'} py={5}>
                    <Button onClick ={handleLogin}>Submit</Button>
                    <Button onClick={handleLoginWithGoogle}>Login with Google</Button>
                    <Button onClick={()=>router.push('/register')}>Register</Button>
                </Flex>

            </FormControl>
        </>
    )
}

export default LoginModule;