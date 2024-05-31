"use client";

import { useState, useEffect } from 'react';
import {
    FormControl,
    FormLabel,
    Input,
    Select,
    RadioGroup,
    Radio,
    HStack,
    Button,
    Flex,
    useToast,
    Spinner,
} from '@chakra-ui/react';
import { useUserContext } from '@/components/context/UserContext';

const UpdateGoalModule = ({ goalId }) => {
    const { userData } = useUserContext();
    const toast = useToast();

    const [goalType, setGoalType] = useState('');
    const [value, setValue] = useState('');
    const [period, setPeriod] = useState('');
    const [periodUnit, setPeriodUnit] = useState('month');
    const [progress, setProgress] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchGoalData = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/goals/${goalId}/`);
                const goalData = await response.json();

                setGoalType(goalData.goal_type);
                setValue(goalData.value);
                setPeriod(goalData.period);
                setPeriodUnit(goalData.period_unit);
                setProgress(goalData.progress);
                setIsLoading(false);
            } catch (error) {
                toast({
                    title: 'Error fetching goal data.',
                    description: error.message,
                    status: 'error',
                    position: 'top-right',
                    isClosable: true,
                });
                setIsLoading(false);
            }
        };

        fetchGoalData();
    }, [goalId, toast]);

    const handleGoalTypeChange = (e) => {
        setGoalType(e.target.value);
    };

    const handleSubmit = async () => {
        const goalData = {
            user_id: userData.id,
            goal_type: goalType,
            value: value ? parseFloat(value) : undefined,
            period: period ? parseInt(period) : undefined,
            period_unit: periodUnit,
            progress: progress ? parseFloat(progress) : undefined,
        };

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/goals/${goalId}/update-goal/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(goalData),
            });

            if (response.status === 200) {
                toast({
                    title: 'Goal updated successfully!',
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
                title: 'Error updating goal.',
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
        <FormControl>
            <FormLabel>Goal Type</FormLabel>
            <Select 
                placeholder='Select goal type' 
                onChange={handleGoalTypeChange}
                value={goalType}
                mb={4}
            >
                <option value='lose_weight'>Weight Loss</option>
                <option value='gain_weight'>Weight Gain</option>
                <option value='calorie_intake'>Calorie Intake</option>
                <option value='calorie_burned'>Calorie Burned</option>
            </Select>

            <FormLabel>Value ({['lose_weight', 'gain_weight'].includes(goalType) ? 'kg' : 'cal'})</FormLabel>
            <Input 
                type='number' 
                step='0.1' 
                onChange={(e) => setValue(e.target.value)}
                value={value}
                mb={4}
            />

            <FormLabel>Period</FormLabel>
            <Input 
                type='number' 
                onChange={(e) => setPeriod(e.target.value)}
                value={period}
                mb={4}
            />

            <FormLabel>Period Unit</FormLabel>
            <RadioGroup onChange={(e) => setPeriodUnit(e)} value={periodUnit} mb={4}>
                <HStack spacing='24px'>
                    <Radio value='hour'>Hour(s)</Radio>
                    <Radio value='day'>Day(s)</Radio>
                    <Radio value='month'>Month(s)</Radio>
                    <Radio value='year'>Year(s)</Radio>
                </HStack>
            </RadioGroup>

            <FormLabel>Progress</FormLabel>
            <Input 
                type='number' 
                step='0.1' 
                onChange={(e) => setProgress(e.target.value)}
                value={progress}
                mb={4}
            />

            <Flex justify={'right'} mt={6}>
                <Button onClick={handleSubmit} colorScheme='teal' size='md'>Update Goal</Button>
            </Flex>
        </FormControl>
    );
}

export default UpdateGoalModule;
