
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

const RegisterModule = () => {
    const router = useRouter();
    const {loading, isAuthenticated, register} = useUserContext();

    useEffect(()=>{
        if(!loading && isAuthenticated){
            router.push('/')
        }
    }, [loading])

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async () => {
        await register({username, password})
    }

    return (
        <>
            <FormControl>
                <FormLabel>Username</FormLabel>
                <Input type='username' onChange={(action)=>setUsername(action.target.value)}/>

                <FormLabel py={5}>Password</FormLabel>
                <Input type='password' onChange={(action)=>setPassword(action.target.value)}/>

                <Flex gap={2} justify={'center'} py={5}>
                    <Button onClick ={handleRegister}>Submit</Button>
                </Flex>

            </FormControl>
        </>
    )
}

export default RegisterModule;