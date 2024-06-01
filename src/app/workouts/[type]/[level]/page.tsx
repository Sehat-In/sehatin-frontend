"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

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

  useEffect(() => {
    if (type && level) {
      fetch(
        `https://meal-service.sehat-in.com/api/v1/workouts/${type}/${level}`
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer, isPaused]);

  const handleStartWorkout = () => {
    if (workout && workout.exercises.length > 0) {
      setCurrentExerciseIndex(0);
      setTimer(workout.exercises[0].duration || 0);
    }
  };

  const handleNextExercise = () => {
    if (workout) {
      const nextIndex = currentExerciseIndex + 1;
      if (isRest) {
        setIsRest(false);
        setTimer(workout.exercises[currentExerciseIndex].duration || 0);
      } else if (nextIndex < workout.exercises.length) {
        setCurrentExerciseIndex(nextIndex);
        setIsRest(true);
        setTimer(30); // Rest period of 30 seconds
      } else {
        alert("Workout Complete!");
        router.push("/workouts");
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

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!workout) {
    return <p>Workout not found</p>;
  }

  const currentExercise = workout.exercises[currentExerciseIndex];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-5xl font-bold text-center mb-12 text-gray-800">
        {workout.name}
      </h1>
      <p className="text-xl text-center mb-8">{workout.description}</p>
      {currentExerciseIndex === -1 && (
        <button
          onClick={handleStartWorkout}
          className="w-full bg-green-500 text-white px-4 py-2 rounded mb-8"
        >
          Start Workout
        </button>
      )}
      {currentExerciseIndex > -1 && (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8 flex flex-col lg:flex-row">
          <div className="relative w-full lg:w-1/2" style={{ height: "50vh" }}>
            <Image
              src={currentExercise.image_url}
              alt={currentExercise.name}
              layout="fill"
              objectFit="contain"
              className="w-full h-full object-center"
            />
          </div>
          <div className="p-6 flex flex-col justify-center items-center lg:w-1/2">
            <h2 className="text-3xl font-bold mb-4 text-center">
              {isRest ? "Rest" : currentExercise.name}
            </h2>
            <div className="text-center mb-6">
              <div className="text-6xl font-bold text-blue-600 mb-2">
                {timer} seconds
              </div>
              {isRest && (
                <p className="text-2xl text-gray-700">Rest for 30 seconds</p>
              )}
            </div>
            {!isRest && (
              <div className="text-center text-gray-700 mb-4">
                {currentExercise.duration && (
                  <p className="text-xl">
                    Duration:{" "}
                    <span className="font-bold">
                      {currentExercise.duration}
                    </span>{" "}
                    seconds
                  </p>
                )}
                {currentExercise.reps && (
                  <p className="text-xl">
                    Reps:{" "}
                    <span className="font-bold">{currentExercise.reps}</span>
                  </p>
                )}
                {currentExercise.sets && (
                  <p className="text-xl">
                    Sets:{" "}
                    <span className="font-bold">{currentExercise.sets}</span>
                  </p>
                )}
              </div>
            )}
            <div className="flex justify-center space-x-4 mb-4">
              {!isPaused ? (
                <button
                  onClick={handlePause}
                  className="bg-yellow-500 text-white px-4 py-2 rounded"
                >
                  Pause
                </button>
              ) : (
                <button
                  onClick={handleContinue}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Continue
                </button>
              )}
              <button
                onClick={isRest ? handleSkipRest : handleNextExercise}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                {isRest ? "Skip Rest" : "Next Exercise"}
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {workout.exercises.map((exercise) => (
          <div
            key={exercise.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
          >
            <div className="relative w-full h-48 md:h-64 lg:h-80">
              <Image
                src={exercise.image_url}
                alt={exercise.name}
                layout="fill"
                objectFit="cover"
                className="w-full h-full object-center"
              />
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-2">{exercise.name}</h2>
              <div className="text-gray-700 mb-4">
                {exercise.duration && (
                  <p>
                    Duration:{" "}
                    <span className="font-bold">{exercise.duration}</span>{" "}
                    seconds
                  </p>
                )}
                {exercise.reps && (
                  <p>
                    Reps: <span className="font-bold">{exercise.reps}</span>
                  </p>
                )}
                {exercise.sets && (
                  <p>
                    Sets: <span className="font-bold">{exercise.sets}</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkoutDetail;
