import { useUserContext } from "@/components/context/UserContext";
import { Button, Flex, Heading, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Spacer, useDisclosure, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import PostCard from "./PostCard";
import CreatePostModule from "./CreatePost";

interface Post {
    title: string,
    content: string,
    username: string,
    created_at: string,
    id: string
}

const UserViewModule = () => {
    const { userData } = useUserContext();
    const toast = useToast();

    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/posts/get/all`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.status === 200) {
                    const data = await response.json();
                    console.log(data);
                    const sortedPosts = data.sort((a: Post, b: Post) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
                    setPosts(sortedPosts);
                } else {
                    const errorData = await response.json();
                    throw new Error(`Error ${response.status}: ${errorData.detail || 'Unknown error'}`);
                }
            } catch (error) {
                if (error instanceof Error) {
                    toast({
                        title: 'Error fetching posts.',
                        description: error.message,
                        status: 'error',
                        position: 'top-right',
                        isClosable: true,
                    });
                } else {
                    toast({
                        title: 'Error fetching posts.',
                        description: 'An unknown error occurred.',
                        status: 'error',
                        position: 'top-right',
                        isClosable: true,
                    });
                }
            }
        };
        fetchPost();
    }, []);

    const modalNewPost = useDisclosure();


    return (
        <>
            <Flex justify='space-between'>
                <Heading size='lg' marginBottom={10}>Hello, {userData.username}! Got anything to share?</Heading>
                <Button colorScheme='teal' size='sm' onClick={modalNewPost.onOpen}>New Post</Button>
            </Flex>
            <Spacer />
            <PostCard dataPost={posts}></PostCard>

            <Modal blockScrollOnMount={false} scrollBehavior='inside' isOpen={modalNewPost.isOpen} onClose={modalNewPost.onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Write something!</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody mb={6}>
                        <CreatePostModule />
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};



export default UserViewModule;