"use client";

import { useState } from 'react';
import {
    FormControl,
    FormLabel,
    Input,
    Button,
    Flex,
    useToast,
    Textarea,
} from '@chakra-ui/react';
import { useUserContext } from '@/components/context/UserContext';

const CreatePostModule = () => {
    const { userData } = useUserContext();
    const toast = useToast();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleSubmit = async () => {
        const postData = {
            username: userData.username,
            title: title,
            content: content
        };

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/posts/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData),
            });

            if (response.status === 201) {
                toast({
                    title: 'Post created successfully!',
                    status: 'success',
                    position: 'top-right',
                    isClosable: true,
                });
            } else {
                const errorData = await response.json();
                throw new Error(`Error ${response.status}: ${errorData.detail || 'Please fill the required data and try again.'}`);
            }
        } catch (error) {
            if (error instanceof Error) {
                toast({
                    title: 'Error creating post.',
                    description: error.message,
                    status: 'error',
                    position: 'top-right',
                    isClosable: true,
                });
            } else {
                toast({
                    title: 'Error creating post.',
                    description: 'An unknown error occurred.',
                    status: 'error',
                    position: 'top-right',
                    isClosable: true,
                });
            }
        } finally {
            setTimeout(() => {
                window.location.reload();
            }, 800);
        }
    };

    return (
        <FormControl isRequired>
            <FormLabel>Title</FormLabel>
            <Input type='title' onChange={(e) => setTitle(e.target.value)} value={title} mb={4}  />

            <FormLabel>Content</FormLabel>
            <Textarea onChange={(e) => setContent(e.target.value)} value={content} mb={4}  />

            <Flex justify={'right'} mt={6}>
                <Button onClick={handleSubmit} colorScheme='teal' size='md'>Post</Button>
            </Flex>
        </FormControl>
    );
}

export default CreatePostModule;
