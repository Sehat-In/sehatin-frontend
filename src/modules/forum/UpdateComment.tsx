"use client";

import { useEffect, useState } from 'react';
import {
    FormControl,
    FormLabel,
    Button,
    Flex,
    useToast,
    Textarea,
    Spinner,
} from '@chakra-ui/react';

interface CommentProp {
    commentId: string
}

const UpdateCommentModule = ({ commentId }: CommentProp ) => {
    const toast = useToast();

    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCommentData = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/comments/get/${commentId}`);
                const commentData = await response.json();
    
                setContent(commentData.content);
                setIsLoading(false);
    
            } catch (error) {
                toast({
                    title: 'Error fetching comment data.',
                    description: error.message,
                    status: 'error',
                    position: 'top-right',
                    isClosable: true,
                });
                setIsLoading(false);
            }
        };

        fetchCommentData();
    }, [commentId, toast]);


    const handleSubmit = async () => {
        const commentData = {
            content: content
        };

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/comments/update/${commentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(commentData),
            });

            if (response.status === 201) {
                toast({
                    title: 'Comment edited successfully!',
                    status: 'success',
                    position: 'top-right',
                    isClosable: true,
                });
            } else {
                const errorData = await response.json();
                throw new Error(`Error ${response.status}: ${errorData.detail || 'Please fill the required data and try again.'}`);
            }
        } catch (error) {
            toast({
                title: 'Error editing comment.',
                description: error.message ,
                status: 'error',
                position: 'top-right',
                isClosable: true,
            });
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
            <FormLabel>Content</FormLabel>
            <Textarea onChange={(e) => setContent(e.target.value)} value={content} mb={4}  />

            <Flex justify={'right'} mt={6}>
                <Button onClick={handleSubmit} colorScheme='teal' size='md'>Save Edit</Button>
            </Flex>
        </FormControl>
    );
}

export default UpdateCommentModule;
