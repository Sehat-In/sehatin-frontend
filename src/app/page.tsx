import { Button, Card, Text, Container, Box } from "@chakra-ui/react";
import React from "react";

export default function Home() {
  return (
    <div
      className="hero min-h-screen"
      style={{
        backgroundImage: "url(/background.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="hero-content relative z-10 text-center text-neutral-content">
        <Container maxW="container.xl" marginX="auto" marginTop="8" p="4">
          <Box textAlign="center" mb="12">
            <Text
              fontSize="4xl"
              color="white"
              fontWeight="bold"
              marginBottom="4"
            >
              Welcome to Sehat-In
            </Text>
            <Text fontSize="lg" color="white">
              Your ultimate companion for a healthy lifestyle.
            </Text>
          </Box>

          <section className="grid md:grid-cols-2 gap-8">
            <Card bg="white" p="6" rounded="lg" shadow="lg">
              <Text fontSize="2xl" fontWeight="bold" marginBottom="2">
                Meal Plan Recommendations
              </Text>
              <Text color="gray.600" marginBottom="4">
                Get personalized meal plans based on your needs.
              </Text>
              <Button
                bg="teal"
                color="white"
                py="2"
                px="4"
                rounded=".25em"
                as="a"
                href="/meals"
              >
                Learn More
              </Button>
            </Card>
            <Card bg="white" p="6" rounded="lg" shadow="lg">
              <Text fontSize="2xl" fontWeight="bold" marginBottom="2">
                Workout Programs
              </Text>
              <Text color="gray.600" marginBottom="4">
                Choose from a variety of workout programs to get started.
              </Text>
              <Button
                bg="teal"
                color="white"
                py="2"
                px="4"
                rounded=".25em"
                as="a"
                href="/workouts"
              >
                Learn More
              </Button>
            </Card>
            <Card bg="white" p="6" rounded="lg" shadow="lg">
              <Text fontSize="2xl" fontWeight="bold" marginBottom="2">
                Progress Tracking
              </Text>
              <Text color="gray.600" marginBottom="4">
                Track your progress with our comprehensive tracking tools.
              </Text>
              <Button
                bg="teal"
                color="white"
                py="2"
                px="4"
                rounded=".25em"
                as="a"
                href="/progress"
              >
                Learn More
              </Button>
            </Card>
            <Card bg="white" p="6" rounded="lg" shadow="lg">
              <Text fontSize="2xl" fontWeight="bold" marginBottom="2">
                Community Forum
              </Text>
              <Text color="gray.600" marginBottom="4">
                Join our community to share tips and get support.
              </Text>
              <Button
                bg="teal"
                color="white"
                py="2"
                px="4"
                rounded=".25em"
                as="a"
                href="/forum"
              >
                Learn More
              </Button>
            </Card>
          </section>
        </Container>
      </div>
    </div>
  );
}
