"use client"

import { useUserContext } from "@/components/context/UserContext";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { Card, CardHeader, Flex, Heading, Spacer, CardBody, Box, Button, Menu, MenuButton, MenuList, MenuItem, MenuDivider, Avatar, CardFooter, Text, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, ButtonGroup, useToast } from "@chakra-ui/react";
import UpdateCommentModule from "./UpdateComment";
import { useState } from "react";
import CreateCommentModule from "./CreateComment";

interface Comment {
    content: string,
    username: string,
    created_at: string,
    id: string
}

interface CommentCardProps {
    dataComment: Comment[];
}

const CommentCard = ({ dataComment }: CommentCardProps) => {
    const { userData } = useUserContext();
    const toast = useToast();
    
    const [currentCommentId, setCurrentCommentId] = useState<string | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [showComments, setShowComments] = useState<{ [key: string]: boolean }>({});

    const modalNewComment = useDisclosure()
    const modalUpdateComment = useDisclosure()
    const modalDeleteComment = useDisclosure()

    const handleUpdateComment = (commentId: string) => {
        setCurrentCommentId(commentId);
        modalUpdateComment.onOpen();
    }

    const handleDeleteCommentModal = (commentId: string) => {
        setCurrentCommentId(commentId);
        modalDeleteComment.onOpen();
    }

    const handleDeleteComment = async (commentId: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/comments/delete/${commentId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                toast({
                    title: 'Comment deleted successfully!',
                    status: 'success',
                    position: 'top-right',
                    isClosable: true,
                });
            } else {
                const errorData = await response.json();
                throw new Error(`Error ${response.status}: ${errorData.detail || 'Unknown Error'}`);
            }
        } catch (error) {
            if (error instanceof Error) {
                toast({
                    title: 'Error deleting comment.',
                    description: error.message,
                    status: 'error',
                    position: 'top-right',
                    isClosable: true,
                });
            } else {
                toast({
                    title: 'Error deleting comment.',
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
                setComments(data);
            } else {
                const errorData = await response.json();
                throw new Error(`Error ${response.status}: ${errorData.detail || 'Unknown error'}`);
            }
        } catch (error) {
            if (error instanceof Error) {
                toast({
                    title: 'Error fetching comment.',
                    description: error.message,
                    status: 'error',
                    position: 'top-right',
                    isClosable: true,
                });
            } else {
                toast({
                    title: 'Error fetching comment.',
                    description: 'An unknown error occurred.',
                    status: 'error',
                    position: 'top-right',
                    isClosable: true,
                });
            }
        }
    };

    if (dataComment && dataComment.length != 0) {
        return (
            <Box display="flex" flexDirection="column" width='95%'>
                {dataComment.map((comment) => (
                    <Card p='3' mb='10' key={comment.id}>
                        <CardHeader>
                            <Flex>
                                {/* <Avatar src={userData.profile.picture} /> */}
                                <Flex flexDirection="column">
                                    <Heading size='sm'>{comment.username}</Heading>
                                </Flex>
                                <Spacer />
                                {userData.username === comment.username && (
                                <Box textAlign='right'>
                                    <Menu>
                                        <MenuButton as={Button} rounded={"full"} variant={"link"} cursor={"pointer"} minW={0}>
                                            <ChevronDownIcon />
                                        </MenuButton>
                                        <MenuList>                                            
                                            <MenuItem onClick={() => handleUpdateComment(comment.id)}>
                                                Edit Comment
                                            </MenuItem>
                                            <MenuDivider />
                                            <MenuItem onClick={() => handleDeleteCommentModal(comment.id)} style={{ color: "red" }}>
                                                Delete
                                            </MenuItem>
                                            </MenuList>
                                        </Menu>
                                    </Box>
                                )}
                            </Flex>
                        </CardHeader>

                        <CardBody>
                            {comment.content}
                        </CardBody>

                        <CardFooter justifyContent={"space-between"}>
                            <Text color="gray">{comment.created_at.substring(0, 10)}</Text>
                        </CardFooter>
                    </Card>
                    
                ))}

                <Modal blockScrollOnMount={false} scrollBehavior='inside' isOpen={modalUpdateComment.isOpen} onClose={modalUpdateComment.onClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Edit Comment</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody mb={6}>
                            {currentCommentId && <UpdateCommentModule commentId={currentCommentId} />}
                        </ModalBody>
                    </ModalContent>
                </Modal>

                <Modal blockScrollOnMount={false} scrollBehavior='inside' isOpen={modalDeleteComment.isOpen} onClose={modalDeleteComment.onClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Delete Comment</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody mb={6}>
                            <Text>Are you sure you want to delete this Comment?</Text>
                        </ModalBody>
                        <ModalFooter>
                            <ButtonGroup gap='1'>
                                <Button onClick={modalDeleteComment.onClose}>Cancel</Button>
                                {currentCommentId && <Button colorScheme='red' onClick={() => handleDeleteComment(currentCommentId)}>Delete</Button>}
                            </ButtonGroup>
                        </ModalFooter>
                    </ModalContent>
                </Modal>

                <Modal blockScrollOnMount={false} scrollBehavior='inside' isOpen={modalNewComment.isOpen} onClose={modalNewComment.onClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>New Comment</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody mb={6}>
                            {currentCommentId && (<CreateCommentModule postId={currentCommentId} />)}
                        </ModalBody>
                    </ModalContent>
                </Modal>

            </Box>

            

        );
    }
}

export default CommentCard;
