"use client";

import { useState, useEffect, ChangeEvent } from 'react';
import {
    Button,
    Flex,
    FormControl,
    FormLabel,
    HStack,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    Radio,
    RadioGroup,
    Select,
    Spinner,
    useToast,
} from '@chakra-ui/react';
import { useUserContext } from '@/components/context/UserContext';

interface GoalData {
    goal_type: string;
    value: string;
    period: string;
    period_unit: string;
    progress: string;
}

interface UpdateGoalModuleProps {
    goalId: number;
}

const UpdateGoalModule = ({ goalId }: UpdateGoalModuleProps) => {
    const { userData } = useUserContext();
    const toast = useToast();

    const [goalType, setGoalType] = useState<string>('');
    const [value, setValue] = useState<string>('');
    const [period, setPeriod] = useState<string>('');
    const [periodUnit, setPeriodUnit] = useState<string>('month');
    const [progress, setProgress] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchGoalData = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/goals/${goalId}/`);
                const goalData: GoalData = await response.json();

                setGoalType(goalData.goal_type);
                setValue(goalData.value);
                setPeriod(goalData.period);
                setPeriodUnit(goalData.period_unit);
                setProgress(goalData.progress);
                setIsLoading(false);
            } catch (error: any) {
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

    const handleGoalTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
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
                    title: 'Goal updated successfully! Please wait for reload.',
                    status: 'success',
                    position: 'top-right',
                    isClosable: true,
                });

                setTimeout(() => {
                    window.location.reload();
                }, 800);
            } else {
                const errorData = await response.json();
                throw new Error(`Error ${response.status}: ${errorData.detail || 'Please fill the required data and try again.'}`);
            }
        } catch (error: any) {
            toast({
                title: 'Error updating goal. Please wait for reload.',
                description: error.message,
                status: 'error',
                position: 'top-right',
                isClosable: true,
            });
        }
    };

    if (isLoading) {
        return (
            <Flex justify="center" align="center" height="100vh">
                <Spinner size="xl" color='teal'/>
            </Flex>
        );
    }

    const maxProgress = value ? parseFloat(value) : undefined;

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
            <NumberInput
                min={1}
                precision={1} 
                step={0.1} 
                onChange={(valueString) => setValue(valueString)}
                value={value}
                mb={4}
            >
                <NumberInputField />
                <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                </NumberInputStepper>
            </NumberInput>

            <FormLabel>Period</FormLabel>
            <NumberInput 
                min={1}
                onChange={(valueString) => setPeriod(valueString)}
                value={period}
                mb={4}
            >
                <NumberInputField />
                <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                </NumberInputStepper>
            </NumberInput>

            <FormLabel>Period Unit</FormLabel>
            <RadioGroup onChange={(e: string) => setPeriodUnit(e)} value={periodUnit} mb={4}>
                <HStack spacing='24px'>
                    <Radio value='hour'>Hour(s)</Radio>
                    <Radio value='day'>Day(s)</Radio>
                    <Radio value='week'>Week(s)</Radio>
                    <Radio value='month'>Month(s)</Radio>
                    <Radio value='year'>Year(s)</Radio>
                </HStack>
            </RadioGroup>

            <FormLabel>Progress</FormLabel>
            <NumberInput 
                min={1}
                max={maxProgress}
                precision={1}
                step={0.1} 
                onChange={(valueString) => setProgress(valueString)}
                value={progress}
                mb={4}
            >
                <NumberInputField />
                <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                </NumberInputStepper>
            </NumberInput>

            <Flex justify={'right'} mt={6}>
                <Button onClick={handleSubmit} colorScheme='teal' size='md'>Update Goal</Button>
            </Flex>
        </FormControl>
    );
}

export default UpdateGoalModule;
