"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";

const MealPlans = () => {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

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
  };

  const handleOptionClick = (option: string) => {
    if (selectedPlan) {
      router.push(`/meals/${option}/${selectedPlan}`);
    }
  };

  const handleCloseModal = () => {
    setSelectedPlan(null);
  };

  const handleEscapePress = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      handleCloseModal();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleEscapePress);
    return () => {
      document.removeEventListener("keydown", handleEscapePress);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-5xl font-bold text-center mb-12 text-gray-800">
        Choose Your Meal Plan
      </h1>
      <div className="flex flex-col gap-8">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="relative bg-cover bg-center h-72 rounded-lg shadow-lg cursor-pointer transition-transform transform hover:scale-105"
            style={{ backgroundImage: `url(${plan.backgroundImage})` }}
            onClick={() => handlePlanClick(plan.id)}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-75 rounded-lg"></div>
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
              <h2 className="text-white text-3xl font-bold mb-4">
                {plan.title}
              </h2>
              <p className="text-white text-lg">{plan.description}</p>
            </div>
          </div>
        ))}
      </div>
      {selectedPlan && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white p-8 rounded-lg shadow-lg text-center relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-black"
              onClick={handleCloseModal}
            >
              X
            </button>
            <h2 className="text-2xl font-bold mb-4">Choose Plan Type</h2>
            <button
              className="bg-blue-500 text-white px-6 py-2 rounded mr-4 hover:bg-blue-600"
              onClick={() => handleOptionClick("daily")}
            >
              Daily Plan
            </button>
            <button
              className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
              onClick={() => handleOptionClick("weekly")}
            >
              Weekly Plan
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MealPlans;
