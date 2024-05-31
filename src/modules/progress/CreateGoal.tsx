"use client";

import { useState } from 'react';
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
} from '@chakra-ui/react';
import { useUserContext } from '@/components/context/UserContext';

const CreateGoalModule = () => {
    const { userData } = useUserContext();
    const toast = useToast();

    const [goalType, setGoalType] = useState('');
    const [value, setValue] = useState('');
    const [period, setPeriod] = useState('');
    const [periodUnit, setPeriodUnit] = useState('month');

    const handleGoalTypeChange = (e) => {
        setGoalType(e.target.value);
        // Reset value when goal type changes
        setValue('');
    };

    const handleSubmit = async () => {
        const goalData = {
            user_id: userData.id,
            goal_type: goalType,
            value: parseFloat(value),
            period: parseInt(period),
            period_unit: periodUnit,
        };

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/goals/new-goal/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(goalData),
            });

            if (response.status === 200) {
                toast({
                    title: 'Goal created successfully!',
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
                title: 'Error creating goal.',
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

    return (
        <FormControl isRequired>
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

            {goalType && (
                <>
                    <FormLabel>Value ({['lose_weight', 'gain_weight'].includes(goalType) ? 'kg' : 'cal'})</FormLabel>
                    <Input 
                        type='number' 
                        step='0.1' 
                        onChange={(e) => setValue(e.target.value)}
                        value={value}
                        mb={4}
                    />
                </>
            )}

            <FormLabel>Period</FormLabel>
            <Input 
                type='number' 
                onChange={(e) => setPeriod(e.target.value)}
                value={period}
                mb={4}
            />

            <FormLabel>Period Unit</FormLabel>
            <RadioGroup onChange={(e) => setPeriodUnit(e)} value={periodUnit}>
                <HStack spacing='24px'>
                    <Radio value='hour'>Hour(s)</Radio>
                    <Radio value='day'>Day(s)</Radio>
                    <Radio value='month'>Month(s)</Radio>
                    <Radio value='year'>Year(s)</Radio>
                </HStack>
            </RadioGroup>

            <Flex justify={'right'} mt={6}>
                <Button onClick={handleSubmit} colorScheme='teal' size='md'>Create Goal</Button>
            </Flex>
        </FormControl>
    );
}

export default CreateGoalModule;
