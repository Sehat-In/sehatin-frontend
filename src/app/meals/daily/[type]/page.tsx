"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUserContext } from "@/components/context/UserContext";
import Image from "next/image";
import {
  FaAppleAlt,
  FaBurn,
  FaDrumstickBite,
  FaLeaf,
  FaBreadSlice,
  FaCube,
  FaPizzaSlice,
  FaUtensils,
} from "react-icons/fa";

interface Meal {
  id: number;
  name: string;
  calories: number;
  carbs: number;
  fat: number;
  protein: number;
  fiber: number;
  sugar: number;
  serving: number;
  image_url: string;
}

const DailyMealPlan = ({ params }: { params: { type: string } }) => {
  const router = useRouter();
  const { type } = params;
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await fetch(
          `https://meal-service.sehat-in.com/api/v1/meals/daily-meal-plan?type=${type}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch meals");
        }
        const data = await response.json();
        setMeals(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMeals();
  }, [type]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">{error}</div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-5xl font-bold text-center mb-12 text-gray-800">
        Daily {type.charAt(0).toUpperCase() + type.slice(1)} Meal Plan
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {meals.map((meal) => (
          <div
            key={meal.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
          >
            <Image
              src={meal.image_url}
              alt={meal.name}
              width={500}
              height={300}
              className="w-full h-64 object-cover"
            />
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">{meal.name}</h2>
              <ul className="text-gray-700 space-y-2">
                <li className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FaBurn className="text-red-500 mr-2" />
                    <span className="font-medium">Calories</span>
                  </div>
                  <span className="font-semibold">{meal.calories}</span>
                </li>
                <li className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FaBreadSlice className="text-yellow-500 mr-2" />
                    <span className="font-medium">Carbs</span>
                  </div>
                  <span className="font-semibold">{meal.carbs}g</span>
                </li>
                <li className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FaPizzaSlice className="text-red-500 mr-2" />
                    <span className="font-medium">Fat</span>
                  </div>
                  <span className="font-semibold">{meal.fat}g</span>
                </li>
                <li className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FaDrumstickBite className="text-blue-500 mr-2" />
                    <span className="font-medium">Protein</span>
                  </div>
                  <span className="font-semibold">{meal.protein}g</span>
                </li>
                <li className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FaLeaf className="text-green-700 mr-2" />
                    <span className="font-medium">Fiber</span>
                  </div>
                  <span className="font-semibold">{meal.fiber}g</span>
                </li>
                <li className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FaCube className="text-purple-500 mr-2" />
                    <span className="font-medium">Sugar</span>
                  </div>
                  <span className="font-semibold">{meal.sugar}g</span>
                </li>
                <li className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FaUtensils className="text-gray-500 mr-2" />
                    <span className="font-medium">Serving</span>
                  </div>
                  <span className="font-semibold">{meal.serving}</span>
                </li>
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DailyMealPlan;
