"use client";

import { useState } from 'react';
import {
    FormControl,
    FormLabel,
    Button,
    Flex,
    useToast,
    Textarea,
} from '@chakra-ui/react';
import { useUserContext } from '@/components/context/UserContext';

interface CommentProp {
    postId: string;
}

const CreateCommentModule = ({ postId }: CommentProp) => {
    const { userData } = useUserContext();
    const toast = useToast();

    const [content, setContent] = useState('');

    const handleSubmit = async () => {
        const commentData = {
            username: userData.username,
            content: content
        };

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/comments/create/${postId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(commentData),
            });

            if (response.status === 200) {
                toast({
                    title: 'Comment created successfully!',
                    status: 'success',
                    position: 'top-right',
                    isClosable: true,
                });
            } else {
                const errorData = await response.json();
                console.log(errorData);
                throw new Error(`Error ${response.status}: ${errorData.detail || 'Please fill the required data and try again.'}`);
            }
        } catch (error) {
            if (error instanceof Error) {
                toast({
                    title: 'Error creating comment.',
                    description: error.message,
                    status: 'error',
                    position: 'top-right',
                    isClosable: true,
                });
            } else {
                toast({
                    title: 'Error creating comment.',
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
            <FormLabel>Content</FormLabel>
            <Textarea onChange={(e) => setContent(e.target.value)} value={content} mb={4}  />

            <Flex justify={'right'} mt={6}>
                <Button onClick={handleSubmit} colorScheme='teal' size='md'>Comment</Button>
            </Flex>
        </FormControl>
    );
}

export default CreateCommentModule;
