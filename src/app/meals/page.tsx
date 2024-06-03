"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useUserContext } from "@/components/context/UserContext";
import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  useDisclosure,
} from "@chakra-ui/react";

const MealPlans = () => {
  const router = useRouter();
  const { isAuthenticated, loading } = useUserContext();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  const plans = [
    {
      id: "high-protein",
      title: "High Protein",
      description:
        "Ideal for those looking to gain weight and build muscle. This meal plan is rich in protein to help support muscle growth and repair.",
      backgroundImage: "/images/high-protein.jpg",
    },
    {
      id: "low-fat",
      title: "Low Fat",
      description:
        "Perfect for individuals aiming to reduce body fat and maintain a lean physique. This plan focuses on minimizing fat intake while providing balanced nutrition.",
      backgroundImage: "/images/low-fat.jpg",
    },
    {
      id: "high-fiber",
      title: "High Fiber",
      description:
        "Designed to promote digestive health and overall well-being. This meal plan is rich in fiber to support a healthy digestive system and prevent constipation.",
      backgroundImage: "/images/high-fiber.jpg",
    },
  ];

  const handlePlanClick = (planId: string) => {
    setSelectedPlan(planId);
    onOpen();
  };

  const handleOptionClick = (option: string) => {
    if (selectedPlan) {
      router.push(`/meals/${option}/${selectedPlan}`);
    }
  };

  return (
    <Box className="min-h-screen bg-gray-100 p-8">
      <Heading
        as="h1"
        className="text-5xl font-bold text-center mb-12 text-gray-800"
      >
        Choose Your Meal Plan
      </Heading>
      <Flex direction="column" gap={8} align="center">
        {plans.map((plan) => (
          <Box
            key={plan.id}
            className="relative bg-cover bg-center h-64 w-full max-w-3xl rounded-lg shadow-lg cursor-pointer transition-transform transform hover:scale-105"
            style={{ backgroundImage: `url(${plan.backgroundImage})` }}
            onClick={() => handlePlanClick(plan.id)}
          >
            <Box className="absolute inset-0 bg-black opacity-70 rounded-lg"></Box>
            <Center className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
              <Heading as="h2" className="text-white text-3xl font-bold mb-2">
                {plan.title}
              </Heading>
              <Text className="text-white text-lg">{plan.description}</Text>
            </Center>
          </Box>
        ))}
      </Flex>
      {selectedPlan && (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Choose Plan Type</ModalHeader>
            <ModalCloseButton className="text-red-500" />
            <ModalBody className="text-center">
              <Button
                className="bg-blue-500 text-white px-6 py-2 rounded mr-4 hover:bg-blue-600"
                onClick={() => handleOptionClick("daily")}
              >
                Daily Plan
              </Button>
              <Button
                className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
                onClick={() => handleOptionClick("weekly")}
              >
                Weekly Plan
              </Button>
            </ModalBody>
            <ModalFooter>
              <Button
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                onClick={onClose}
              >
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
};

export default MealPlans;
