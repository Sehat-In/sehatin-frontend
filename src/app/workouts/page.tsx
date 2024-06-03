"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FaChevronDown,
  FaChevronUp,
  FaDumbbell,
  FaHeartbeat,
  FaChild,
} from "react-icons/fa";
import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Text,
  VStack,
  useDisclosure,
  useOutsideClick,
  useToast,
} from "@chakra-ui/react";
import { useUserContext } from "@/components/context/UserContext";

const workoutPrograms = [
  {
    id: "cardio",
    title: "Cardio",
    description:
      "Improve your cardiovascular health with these effective workouts.",
    explanation:
      "Ideal for those looking to improve heart health and endurance.",
    bannerImage: "/images/cardio.jpg",
    levels: [
      {
        id: "beginner",
        title: "Beginner",
        description: "Perfect for newcomers to cardio workouts.",
        parameters: "Light exercises, short durations.",
      },
      {
        id: "intermediate",
        title: "Intermediate",
        description: "For those with some cardio experience.",
        parameters: "Moderate intensity, medium durations.",
      },
      {
        id: "advanced",
        title: "Advanced",
        description: "Challenging workouts for experienced individuals.",
        parameters: "High intensity, long durations.",
      },
    ],
  },
  {
    id: "strength",
    title: "Strength",
    description: "Build your strength and muscle with these exercises.",
    explanation:
      "Suitable for those aiming to increase muscle mass and strength.",
    bannerImage: "/images/strength.jpg",
    levels: [
      {
        id: "beginner",
        title: "Beginner",
        description: "Perfect for newcomers to strength training.",
        parameters: "Light weights, basic exercises.",
      },
      {
        id: "intermediate",
        title: "Intermediate",
        description: "For those with some strength training experience.",
        parameters: "Moderate weights, compound exercises.",
      },
      {
        id: "advanced",
        title: "Advanced",
        description: "Challenging workouts for experienced lifters.",
        parameters: "Heavy weights, advanced exercises.",
      },
    ],
  },
  {
    id: "flexibility",
    title: "Flexibility",
    description: "Enhance your flexibility and range of motion.",
    explanation:
      "Ideal for those looking to improve their flexibility and prevent injuries.",
    bannerImage: "/images/flexibility.jpg",
    levels: [
      {
        id: "beginner",
        title: "Beginner",
        description: "Perfect for newcomers to flexibility exercises.",
        parameters: "Basic stretches, short durations.",
      },
      {
        id: "intermediate",
        title: "Intermediate",
        description: "For those with some experience in flexibility exercises.",
        parameters: "Moderate stretches, medium durations.",
      },
      {
        id: "advanced",
        title: "Advanced",
        description:
          "Challenging flexibility workouts for experienced individuals.",
        parameters: "Advanced stretches, long durations.",
      },
    ],
  },
];

const WorkoutPlans = () => {
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const { loading, isAuthenticated } = useUserContext();
  const toast = useToast();

  useOutsideClick({
    ref: dropdownRef,
    handler: () => {
      if (isOpen) {
        onClose();
      }
    },
  });

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  if (loading) return <p>Loading...</p>;
  if (!isAuthenticated) {
    router.push("/login"); // Redirect to login if not authenticated
    return null;
  }

  const handleProgramClick = (programId: string) => {
    setSelectedProgram(programId);
    setSelectedLevel(null); // Reset level selection when a new program is selected
  };

  const handleLevelClick = (levelId: string) => {
    setSelectedLevel(levelId);
    onClose(); // Close dropdown after selection
  };

  const handleStartWorkout = () => {
    if (selectedProgram && selectedLevel) {
      router.push(`/workouts/${selectedProgram}/${selectedLevel}`);
    } else {
      toast({
        title: "Please select a workout plan and level.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const selectedProgramDetails = workoutPrograms.find(
    (program) => program.id === selectedProgram
  );

  return (
    <Box minH="100vh" bg="gray.100" p={8}>
      <Heading as="h1" size="2xl" textAlign="center" mb={12} color="gray.800">
        Choose Your Workout Plan
      </Heading>
      <Grid
        templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
        gap={8}
        mb={12}
      >
        {workoutPrograms.map((program) => (
          <Box
            key={program.id}
            bgImage={`url(${program.bannerImage})`}
            bgSize="cover"
            bgPosition="center"
            aspectRatio={4 / 5}
            borderRadius="lg"
            boxShadow="lg"
            cursor="pointer"
            onClick={() => handleProgramClick(program.id)}
            position="relative"
          >
            <Flex
              position="absolute"
              inset="0"
              bgGradient="linear(to-t, blackAlpha.800, transparent)"
              borderRadius="lg"
              justify="center"
              align="center"
              direction="column"
            >
              <Heading as="h2" size="lg" color="white" mb={2}>
                {program.title}
              </Heading>
              <Text color="white" textAlign="center" px={4}>
                {program.description}
              </Text>
            </Flex>
          </Box>
        ))}
      </Grid>
      {selectedProgramDetails && (
        <Box bg="white" p={8} borderRadius="lg" boxShadow="lg" mb={12}>
          <Heading as="h2" size="xl" mb={4}>
            {selectedProgramDetails.title}
          </Heading>
          <Text color="gray.700" mb={4}>
            {selectedProgramDetails.explanation}
          </Text>
          <Box mb={4} position="relative" ref={dropdownRef}>
            <Button
              onClick={onOpen}
              w="full"
              bg="blue.500"
              color="white"
              _hover={{ bg: "blue.600" }}
              rightIcon={isOpen ? <FaChevronUp /> : <FaChevronDown />}
            >
              {selectedLevel
                ? selectedProgramDetails.levels.find(
                    (level) => level.id === selectedLevel
                  )?.title
                : "Select Difficulty Level"}
            </Button>
            {isOpen && (
              <Box
                position="absolute"
                w="full"
                bg="white"
                border="1px solid"
                borderColor="gray.200"
                borderRadius="md"
                boxShadow="lg"
                mt={2}
                zIndex={10}
              >
                {selectedProgramDetails.levels.map((level) => (
                  <Box
                    key={level.id}
                    p={4}
                    cursor="pointer"
                    _hover={{ bg: "gray.200" }}
                    onClick={() => handleLevelClick(level.id)}
                  >
                    <Heading as="h3" size="md" mb={1}>
                      {level.title}
                    </Heading>
                    <Text color="gray.600">{level.description}</Text>
                    <Text fontSize="sm" color="gray.500">
                      {level.parameters}
                    </Text>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
          {selectedLevel && (
            <Button
              onClick={handleStartWorkout}
              w="full"
              bg="green.500"
              color="white"
              _hover={{ bg: "green.600" }}
            >
              Start Workout
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
};

export default WorkoutPlans;
