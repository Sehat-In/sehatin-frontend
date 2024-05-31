"use client";

import { useEffect, useState } from 'react';
import { 
    Box,
    Button,
    ButtonGroup,
    Card,
    CardHeader,
    CardBody,
    Flex,
    Heading,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Progress,
    Spacer,
    Spinner,
    Stat,
    StatLabel,
    StatNumber,
    Text,
    useDisclosure,
    useToast,
    VStack,
} from '@chakra-ui/react';

import { useUserContext } from '@/components/context/UserContext';
import CreateGoalModule from "@/modules/progress/CreateGoal";
import UpdateGoalModule from "@/modules/progress/UpdateGoal";

interface Goal {
    user_id: number;
    goal_type: string;
    value: number;
    period: number;
    period_unit: string;
    progress: number;
    is_completed: boolean;
    id: number;
    progress_percentage: number;
}

const UserViewModule = () => {
    const { userData } = useUserContext();
    const toast = useToast();
    
    const [overallProgress, setOverallProgress] = useState<number>(0);
    const [goals, setGoals] = useState<Goal[]>([]);
    const [currentGoalId, setCurrentGoalId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [noGoals, setNoGoals] = useState<boolean>(false);

    useEffect(() => {
        const fetchOverallProgress = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/${userData.id}/progress/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.status === 200) {
                    const data = await response.json();
                    setOverallProgress(data.overall_progress_percentage);
                } else {
                    const errorData = await response.json();
                    throw new Error(`Error ${response.status}: ${errorData.detail || 'Unknown error'}`);
                }
            } catch (error) {
                toast({
                    title: 'Error fetching user progress.',
                    description: error.message,
                    status: 'error',
                    position: 'top-right',
                    isClosable: true,
                });
            }
        };

        const fetchUserGoals = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/${userData.id}/goals/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.status === 200) {
                    const data = await response.json();
                    setGoals(data);
                    setNoGoals(data.length === 0);
                } else if (response.status === 404) {
                    setNoGoals(true);
                } else {
                    const errorData = await response.json();
                    throw new Error(`Error ${response.status}: ${errorData.detail || 'Unknown error'}`);
                }
            } catch (error) {
                toast({
                    title: 'Error fetching user goals.',
                    description: error.message,
                    status: 'error',
                    position: 'top-right',
                    isClosable: true,
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchOverallProgress();
        fetchUserGoals();
    }, []);

    const modalNewGoal = useDisclosure();
    const modalUpdateGoal = useDisclosure();
    const modalDeleteGoal = useDisclosure();
    const modalClearGoals = useDisclosure();

    const handleUpdateGoal = (goalId: number) => {
        setCurrentGoalId(goalId);
        modalUpdateGoal.onOpen();
    };

    const handleDeleteGoalModal = (goalId: number) => {
        setCurrentGoalId(goalId);
        modalDeleteGoal.onOpen()
    };

    const handleDeleteGoal = async (goalId: number) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/goals/${goalId}/delete-goal/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                toast({
                    title: 'Goal deleted successfully!',
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
                title: 'Error deleting goal.',
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

    const handleClearGoals = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/${userData.id}/clear-progress/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                toast({
                    title: 'Goals cleared successfully!',
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
                title: 'Error clearing goals.',
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

    if (isLoading) {
        return (
            <Flex justify="center" align="center" height="100vh">
                <Spinner size="xl" color='teal'/>
            </Flex>
        );
    }

    return (
        <>
            <Card p='3' mb='10'>
                <CardHeader>
                    <Flex>
                        <Heading size='lg'>Hello, {userData.username}!</Heading>
                        <Spacer />
                        <Box textAlign='right'>
                            <Stat>
                                <StatLabel>Overall Goal Progress</StatLabel>
                                <StatNumber>{overallProgress}%</StatNumber>
                            </Stat>
                        </Box>
                    </Flex>
                </CardHeader>

                <CardBody>
                    <Progress value={overallProgress} colorScheme='teal' size='md' mb='2'/>
                </CardBody>
            </Card>

            <Flex alignItems='center' px='2' mb='8'>
                <Box>
                    <Heading as='h4' size='md'>Your Goals</Heading>
                </Box>
                <Spacer />
                <ButtonGroup gap='1'>
                    {!noGoals && <Button colorScheme='red' variant='outline' size='sm' onClick={modalClearGoals.onOpen}>Clear Goals</Button>}
                    <Button colorScheme='teal' size='sm' onClick={modalNewGoal.onOpen}>New Goal</Button>
                </ButtonGroup>
            </Flex>

            {noGoals ? (
                <Text px='2'>You currently don't have any goals.</Text>
            ) : (
                <VStack spacing='4' align='stretch'>
                    {goals.map((goal) => (
                        <Card key={goal.id} p='2'>
                            <CardHeader>
                                <Flex alignItems='center'>
                                <Heading as='h5' size='sm' textTransform='uppercase'>
                                    {`${goal.goal_type.replace(/_/g, ' ')} - ${goal.value} ${goal.goal_type.toLowerCase().includes('weight') ? 'kg' : 'cal'} in ${goal.period} ${goal.period_unit}${goal.period > 1 ? 's' : ''}`}
                                </Heading>
                                <Spacer />
                                <Box textAlign='right'>
                                    <Stat size='sm'>
                                        <StatLabel>Current Progress</StatLabel>
                                        <StatNumber>{`${goal.progress}/${goal.value} ${goal.goal_type.toLowerCase().includes('weight') ? 'kg' : 'cal'}`}</StatNumber>
                                    </Stat>
                                </Box>
                                </Flex>
                            </CardHeader>

                            <CardBody>
                                <Flex justifyContent='flex-end'>
                                    <Text fontSize='sm' as='b'>{goal.progress_percentage}%</Text>
                                </Flex>
                                <Progress value={goal.progress_percentage} colorScheme='teal' size='sm' mb='8' />
                                <Flex justifyContent='flex-end'>
                                    <ButtonGroup gap='1'>
                                        <Button size='sm' colorScheme='red' variant='outline' onClick={() => handleDeleteGoalModal(goal.id)}>Delete</Button>
                                        <Button size='sm' colorScheme='yellow' variant='outline' onClick={() => handleUpdateGoal(goal.id)}>Update</Button>
                                    </ButtonGroup>
                                </Flex>
                            </CardBody>
                        </Card>
                    ))}
                </VStack>
            )}

            <Modal blockScrollOnMount={false} scrollBehavior='inside' isOpen={modalNewGoal.isOpen} onClose={modalNewGoal.onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>New Goal</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody mb={6}>
                        <CreateGoalModule />
                    </ModalBody>
                </ModalContent>
            </Modal>

            <Modal blockScrollOnMount={false} scrollBehavior='inside' isOpen={modalUpdateGoal.isOpen} onClose={modalUpdateGoal.onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Update Goal</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody mb={6}>
                        {currentGoalId && <UpdateGoalModule goalId={currentGoalId} />}
                    </ModalBody>
                </ModalContent>
            </Modal>

            <Modal blockScrollOnMount={false} scrollBehavior='inside' isOpen={modalDeleteGoal.isOpen} onClose={modalDeleteGoal.onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Delete Goal</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody mb={6}>
                        <Text>Are you sure you want to delete this goal?</Text>
                    </ModalBody>
                    <ModalFooter>
                        <ButtonGroup gap='1'>
                            <Button onClick={modalDeleteGoal.onClose}>Cancel</Button>
                            {currentGoalId && <Button colorScheme='red' onClick={() => handleDeleteGoal(currentGoalId)}>Delete</Button>}
                        </ButtonGroup>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <Modal blockScrollOnMount={false} scrollBehavior='inside' isOpen={modalClearGoals.isOpen} onClose={modalClearGoals.onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Clear Goals</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody mb={6}>
                        <Text>Are you sure you want to delete all of your goals and progress?</Text>
                    </ModalBody>
                    <ModalFooter>
                        <ButtonGroup gap='1'>
                            <Button onClick={modalClearGoals.onClose}>Cancel</Button>
                            <Button colorScheme='red' onClick={() => handleClearGoals()}>Clear</Button>
                        </ButtonGroup>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default UserViewModule;
