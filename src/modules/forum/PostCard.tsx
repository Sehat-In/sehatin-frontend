"use client"

import { useUserContext } from "@/components/context/UserContext";
import { ChatIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Card, CardHeader, Flex, Heading, Spacer, CardBody, Box, Button, Menu, MenuButton, MenuList, MenuItem, MenuDivider, Avatar, CardFooter, Text, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, ButtonGroup, useToast } from "@chakra-ui/react";
import { useState } from "react";
import UpdatePostModule from "./UpdatePost";
import CommentCard from "./CommentCard";
import CreateCommentModule from "./CreateComment";

interface Post {
    title: string,
    content: string,
    username: string,
    created_at: string,
    id: string
}

interface Comment {
    content: string,
    username: string,
    created_at: string,
    id: string
}

interface PostCardProps {
    dataPost: Post[];
}

const PostCard = ({ dataPost }: PostCardProps) => {
    const { userData } = useUserContext();
    const toast = useToast();
    
    const [currentPostId, setCurrentPostId] = useState<string>('');
    const [comments, setComments] = useState<{ [key: string]: Comment[] }>({});
    const [showComments, setShowComments] = useState<{ [key: string]: boolean }>({});

    const modalUpdatePost = useDisclosure()
    const modalDeletePost = useDisclosure()
    const modalNewComment = useDisclosure()

    const handleUpdatePost = (postId: string) => {
        setCurrentPostId(postId);
        modalUpdatePost.onOpen();
    }

    const handleDeletePostModal = (postId: string) => {
        setCurrentPostId(postId);
        modalDeletePost.onOpen();
    }

    const handleNewComment = (postId: string) => {
        setCurrentPostId(postId);
        modalNewComment.onOpen();
    }

    const handleDeletePost = async (postId: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/posts/delete/${postId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 201) {
                toast({
                    title: 'Post deleted successfully!',
                    status: 'success',
                    position: 'top-right',
                    isClosable: true,
                });
            } else {
                const errorData = await response.json();
                throw new Error(`Error ${response.status}: ${errorData.detail || 'Unknown Error'}`);
            }
        } catch (error) {
            toast({
                title: 'Error deleting post.',
                description: error.message,
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

    const fetchComment = async (postId: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/comments/get/${postId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                const data = await response.json();
                setComments(prevComments => ({ ...prevComments, [postId]: data }));
            } else {
                const errorData = await response.json();
                throw new Error(`Error ${response.status}: ${errorData.detail || 'Unknown error'}`);
            }
        } catch (error) {
            toast({
                title: 'Error fetching comments.',
                description: error.message,
                status: 'error',
                position: 'top-right',
                isClosable: true,
            });
        }
    };

    const handleToggleComments = (postId: string) => {
        const isCurrentlyVisible = showComments[postId];
        setShowComments(prevState => ({ ...prevState, [postId]: !isCurrentlyVisible }));
        if (!isCurrentlyVisible && !comments[postId]) {
            fetchComment(postId);
        }
    }

    if (dataPost && dataPost.length != 0) {
        return (
            <Box display="flex" flexDirection="column" width='100%'>
                {dataPost.map((post) => (
                    <Card p='3' mb='10' key={post.id}>
                        <CardHeader>
                            <Flex>
                                {/* <Avatar src={userData.profile.picture} /> */}
                                <Flex flexDirection="column">
                                    <Heading size='sm'>{post.username}</Heading>
                                    <Heading size='md' marginBottom='2'>{post.title}</Heading>
                                </Flex>
                                <Spacer />
                                <Box textAlign='right'>
                                    <Menu>
                                        <MenuButton as={Button} rounded={"full"} variant={"link"} cursor={"pointer"} minW={0}>
                                            <ChevronDownIcon />
                                        </MenuButton>
                                        <MenuList>
                                            <MenuItem>
                                                Subscribe
                                            </MenuItem>
                                            <MenuItem onClick={() => handleNewComment(post.id)}>
                                                Reply
                                            </MenuItem>

                                            {userData.username === post.username && (
                                                <>
                                                    <MenuItem onClick={() => handleUpdatePost(post.id)}>
                                                        Edit Post
                                                    </MenuItem>
                                                    <MenuDivider />
                                                    <MenuItem onClick={() => handleDeletePostModal(post.id)} style={{ color: "red" }}>
                                                        Delete
                                                    </MenuItem>
                                                </>
                                            )}
                                        </MenuList>
                                    </Menu>
                                </Box>
                            </Flex>
                        </CardHeader>

                        <CardBody>
                            {post.content}
                        </CardBody>

                        <CardFooter justifyContent={"space-between"}>
                            <Text color="gray">{post.created_at.substring(0, 10)}</Text>
                            <Button onClick={() => handleToggleComments(post.id)}>
                                <ChatIcon />
                            </Button>
                        </CardFooter>

                        {showComments[post.id] && (
                            <Flex justify="right">
                                <CommentCard dataComment={comments[post.id] || []} />
                            </Flex>
                        )}
                    </Card>
                ))}

                <Modal blockScrollOnMount={false} scrollBehavior='inside' isOpen={modalUpdatePost.isOpen} onClose={modalUpdatePost.onClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Update Post</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody mb={6}>
                            {currentPostId && <UpdatePostModule postId={currentPostId} />}
                        </ModalBody>
                    </ModalContent>
                </Modal>

                <Modal blockScrollOnMount={false} scrollBehavior='inside' isOpen={modalDeletePost.isOpen} onClose={modalDeletePost.onClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Delete Post</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody mb={6}>
                            <Text>Are you sure you want to delete this post?</Text>
                        </ModalBody>
                        <ModalFooter>
                            <ButtonGroup gap='1'>
                                <Button onClick={modalDeletePost.onClose}>Cancel</Button>
                                {currentPostId && <Button colorScheme='red' onClick={() => handleDeletePost(currentPostId)}>Delete</Button>}
                            </ButtonGroup>
                        </ModalFooter>
                    </ModalContent>
                </Modal>

                <Modal blockScrollOnMount={false} scrollBehavior='inside' isOpen={modalNewComment.isOpen} onClose={modalNewComment.onClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Write something back!</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody mb={6}>
                            <CreateCommentModule postId={currentPostId} />
                        </ModalBody>
                    </ModalContent>
                </Modal>
            </Box>
        );
    }
}

export default PostCard;
