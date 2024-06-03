"use client";

import { useEffect, useState } from 'react';
import {
    FormControl,
    FormLabel,
    Input,
    Button,
    Flex,
    useToast,
    Textarea,
    Spinner,
} from '@chakra-ui/react';

interface PostProp {
    postId: string
}

const UpdatePostModule = ({ postId }: PostProp ) => {
    const toast = useToast();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPostData = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/posts/get/${postId}`);
                const postData = await response.json();
    
                setTitle(postData.title);
                setContent(postData.content);
                setIsLoading(false);
    
            } catch (error) {
                if (error instanceof Error) {
                    toast({
                        title: 'Error fetching post data.',
                        description: error.message,
                        status: 'error',
                        position: 'top-right',
                        isClosable: true,
                    });
                } else {
                    toast({
                        title: 'Error fetching post data.',
                        description: 'An unknown error occurred.',
                        status: 'error',
                        position: 'top-right',
                        isClosable: true,
                    });
                }
                setIsLoading(false);
            }
        };

        fetchPostData();
    }, [postId, toast]);


    const handleSubmit = async () => {
        const postData = {
            title: title,
            content: content
        };

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/posts/update/${postId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData),
            });

            if (response.status === 200) {
                toast({
                    title: 'Post edited successfully!',
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
                    title: 'Error editing post.',
                    description: error.message,
                    status: 'error',
                    position: 'top-right',
                    isClosable: true,
                });
            } else {
                toast({
                    title: 'Error editing post.',
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

    if (isLoading) {
        return (
            <Flex justify="center" align="center" height="100vh">
                <Spinner size="xl" color='teal'/>
            </Flex>
        );
    }

    return (
        <FormControl isRequired>
            <FormLabel>Title</FormLabel>
            <Input type='title' onChange={(e) => setTitle(e.target.value)} value={title} mb={4}  />

            <FormLabel>Content</FormLabel>
            <Textarea onChange={(e) => setContent(e.target.value)} value={content} mb={4}  />

            <Flex justify={'right'} mt={6}>
                <Button onClick={handleSubmit} colorScheme='teal' size='md'>Save Edit</Button>
            </Flex>
        </FormControl>
    );
}

export default UpdatePostModule;
