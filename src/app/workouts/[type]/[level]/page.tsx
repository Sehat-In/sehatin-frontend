"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Spinner,
  Text,
  VStack,
  CircularProgress,
  CircularProgressLabel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";

interface Exercise {
  id: number;
  name: string;
  reps: number | null;
  sets: number | null;
  duration: number | null;
  image_url: string;
}

interface Workout {
  name: string;
  description: string;
  duration: number;
  calories: number;
  type: string;
  difficulty: string;
  id: number;
  image_url: string | null;
  exercises: Exercise[];
}

const WorkoutDetail = () => {
  const router = useRouter();
  const params = useParams();
  const type = params.type;
  const level = params.level;

  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState<number>(-1);
  const [isRest, setIsRest] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (type && level) {
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/workouts/${type}/${level}`
      )
        .then((response) => response.json())
        .then((data) => {
          setWorkout(data[0]);
          setLoading(false);
        });
    }
  }, [type, level]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (timer > 0 && !isPaused) {
      timeout = setTimeout(() => setTimer(timer - 1), 1000);
    } else if (timer === 0 && currentExerciseIndex >= 0 && !isPaused) {
      handleNextExercise();
    }
    return () => clearTimeout(timeout);
  }, [timer, isPaused]);

  const handleStartWorkout = () => {
    if (workout && workout.exercises.length > 0) {
      setCurrentExerciseIndex(0);
      if (workout.exercises[0].duration) {
        setTimer(workout.exercises[0].duration);
      }
    }
  };

  const handleNextExercise = () => {
    if (workout) {
      const nextIndex = currentExerciseIndex + 1;
      if (isRest) {
        setIsRest(false);
        if (workout.exercises[currentExerciseIndex].duration) {
          setTimer(workout.exercises[currentExerciseIndex].duration);
        }
      } else if (nextIndex < workout.exercises.length) {
        setCurrentExerciseIndex(nextIndex);
        setIsRest(true);
        setTimer(30); // Rest period of 30 seconds
      } else {
        onOpen();
      }
    }
  };

  const handleSkipRest = () => {
    setIsRest(false);
    handleNextExercise();
  };

  const handlePause = () => {
    setIsPaused(true);
  };

  const handleContinue = () => {
    setIsPaused(false);
  };

  const handleCloseModal = () => {
    onClose();
    router.push("/workouts");
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="100vh" bg="gray.100">
        <Spinner size="xl" color="blue.500" />
      </Flex>
    );
  }

  if (!workout) {
    return (
      <Flex justify="center" align="center" minH="100vh" bg="gray.100">
        <Text fontSize="2xl">Workout not found</Text>
      </Flex>
    );
  }

  const currentExercise = workout.exercises[currentExerciseIndex];

  return (
    <Box minH="100vh" bg="gray.100" p={8}>
      <Heading as="h1" size="2xl" textAlign="center" mb={12} color="gray.800">
        {workout.name}
      </Heading>
      <Text fontSize="xl" textAlign="center" mb={8}>
        {workout.description}
      </Text>
      {currentExerciseIndex === -1 ? (
        <Button
          onClick={handleStartWorkout}
          w="full"
          bg="green.500"
          color="white"
          size="lg"
          _hover={{ bg: "green.600" }}
          mb={8}
        >
          Start Workout
        </Button>
      ) : (
        <Box bg="white" borderRadius="lg" shadow="lg" overflow="hidden" mb={8}>
          <Grid
            templateColumns={{ base: "1fr", lg: "1fr 1fr" }}
            h={{ base: "70vh", lg: "80vh" }}
          >
            <Box position="relative" h="100%">
              <Image
                src={currentExercise.image_url}
                alt={currentExercise.name}
                layout="fill"
                objectFit="contain"
              />
            </Box>
            <Flex direction="column" p={6} justify="center" align="center">
              <Heading as="h2" size="xl" mb={4} textAlign="center">
                {isRest ? "Rest" : currentExercise.name}
              </Heading>
              {isRest ? (
                <>
                  <Text fontSize="2xl" color="gray.700" mb={4}>
                    Rest for 30 seconds
                  </Text>
                  <CircularProgress
                    value={30 - timer}
                    max={30}
                    size="120px"
                    color="blue.500"
                    mb={6}
                  >
                    <CircularProgressLabel fontSize="2xl">
                      {30 - timer}s
                    </CircularProgressLabel>
                  </CircularProgress>
                </>
              ) : currentExercise.duration ? (
                <CircularProgress
                  value={timer}
                  max={currentExercise.duration}
                  size="120px"
                  color="blue.500"
                  mb={6}
                >
                  <CircularProgressLabel fontSize="2xl">
                    {timer}s
                  </CircularProgressLabel>
                </CircularProgress>
              ) : (
                <VStack spacing={2} mb={4}>
                  <Text fontSize="xl">
                    Reps:{" "}
                    <Text as="span" fontWeight="bold">
                      {currentExercise.reps}
                    </Text>
                  </Text>
                  <Text fontSize="xl">
                    Sets:{" "}
                    <Text as="span" fontWeight="bold">
                      {currentExercise.sets}
                    </Text>
                  </Text>
                </VStack>
              )}
              <Flex justify="center" wrap="wrap" gap={4}>
                {!isPaused ? (
                  <Button
                    onClick={handlePause}
                    bg="yellow.500"
                    color="white"
                    _hover={{ bg: "yellow.600" }}
                  >
                    Pause
                  </Button>
                ) : (
                  <Button
                    onClick={handleContinue}
                    bg="green.500"
                    color="white"
                    _hover={{ bg: "green.600" }}
                  >
                    Continue
                  </Button>
                )}
                <Button
                  onClick={isRest ? handleSkipRest : handleNextExercise}
                  bg="blue.500"
                  color="white"
                  _hover={{ bg: "blue.600" }}
                >
                  {isRest ? "Skip Rest" : "Next Exercise"}
                </Button>
              </Flex>
            </Flex>
          </Grid>
        </Box>
      )}
      <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={8}>
        {workout.exercises.map((exercise) => (
          <Box
            key={exercise.id}
            bg="white"
            borderRadius="lg"
            shadow="lg"
            overflow="hidden"
          >
            <Box position="relative" h={{ base: "48", md: "64", lg: "80" }}>
              <Image
                src={exercise.image_url}
                alt={exercise.name}
                layout="fill"
                objectFit="cover"
              />
            </Box>
            <Box p={6}>
              <Heading as="h2" size="lg" mb={2}>
                {exercise.name}
              </Heading>
              <VStack spacing={2} align="start">
                {exercise.duration && (
                  <Text>
                    Duration:{" "}
                    <Text as="span" fontWeight="bold">
                      {exercise.duration}
                    </Text>{" "}
                    seconds
                  </Text>
                )}
                {exercise.reps && (
                  <Text>
                    Reps:{" "}
                    <Text as="span" fontWeight="bold">
                      {exercise.reps}
                    </Text>
                  </Text>
                )}
                {exercise.sets && (
                  <Text>
                    Sets:{" "}
                    <Text as="span" fontWeight="bold">
                      {exercise.sets}
                    </Text>
                  </Text>
                )}
              </VStack>
            </Box>
          </Box>
        ))}
      </Grid>

      <Modal isOpen={isOpen} onClose={handleCloseModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Workout Complete!</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Congratulations, you have completed your workout!</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleCloseModal}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default WorkoutDetail;
