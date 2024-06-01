"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaChevronDown,
  FaChevronUp,
  FaDumbbell,
  FaHeartbeat,
  FaChild,
} from "react-icons/fa";

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
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const router = useRouter();

  const handleProgramClick = (programId: string) => {
    setSelectedProgram(programId);
    setSelectedLevel(null); // Reset level selection when a new program is selected
  };

  const handleLevelClick = (levelId: string) => {
    setSelectedLevel(levelId);
    setShowDropdown(false);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleStartWorkout = () => {
    if (selectedProgram && selectedLevel) {
      router.push(`/workouts/${selectedProgram}/${selectedLevel}`);
    }
  };

  const selectedProgramDetails = workoutPrograms.find(
    (program) => program.id === selectedProgram
  );

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-5xl font-bold text-center mb-12 text-gray-800">
        Choose Your Workout Plan
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {workoutPrograms.map((program) => (
          <div
            key={program.id}
            className="relative bg-cover bg-center h-64 rounded-lg shadow-lg cursor-pointer"
            style={{ backgroundImage: `url(${program.bannerImage})` }}
            onClick={() => handleProgramClick(program.id)}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-75 flex flex-col justify-center items-center rounded-lg">
              <h2 className="text-white text-3xl font-bold mb-2">
                {program.title}
              </h2>
              <p className="text-white text-center px-4">
                {program.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      {selectedProgramDetails && (
        <div className="bg-white p-8 rounded-lg shadow-lg mb-12">
          <h2 className="text-4xl font-bold mb-4">
            {selectedProgramDetails.title}
          </h2>
          <p className="text-gray-700 mb-4">
            {selectedProgramDetails.explanation}
          </p>
          <div className="relative mb-4">
            <button
              onClick={toggleDropdown}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded flex justify-between items-center"
            >
              <span>
                {selectedLevel
                  ? selectedProgramDetails.levels.find(
                      (level) => level.id === selectedLevel
                    )?.title
                  : "Select Difficulty Level"}
              </span>
              {showDropdown ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {showDropdown && (
              <div className="absolute w-full bg-white border rounded shadow-lg mt-2 z-10 mb-12">
                {selectedProgramDetails.levels.map((level) => (
                  <div
                    key={level.id}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                    onClick={() => handleLevelClick(level.id)}
                  >
                    <h3 className="text-xl font-semibold">{level.title}</h3>
                    <p className="text-gray-600">{level.description}</p>
                    <p className="text-sm text-gray-500">{level.parameters}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          {selectedLevel && (
            <button
              onClick={handleStartWorkout}
              className="w-full bg-green-500 text-white px-4 py-2 rounded"
            >
              Start Workout
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default WorkoutPlans;
