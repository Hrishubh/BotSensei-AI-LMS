"use client";

import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StudyPageLayout from "../_components/StudyPageLayout";
import ContentCard from "../_components/ContentCard";
import LoadingSpinner from "../../../../components/ui/LoadingSpinner";
import { Clock, CheckCircle, XCircle, Trophy, RotateCcw, ArrowLeft } from "lucide-react";

function GamifiedQuiz() {
  const { courseId } = useParams();
  const router = useRouter();
  const [stepCount, setStepCount] = useState(0);
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(15);
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    GetQuiz();
  }, []);

  useEffect(() => {
    if (timer > 0 && selectedOption === null && !quizCompleted) {
      const countdown = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(countdown);
    } else if (timer === 0 && !quizCompleted) {
      handleTimeout();
    }
  }, [timer, selectedOption, quizCompleted]);

  const GetQuiz = async () => {
    try {
      setLoading(true);
      const result = await axios.post("/api/study-type", {
        courseId: courseId,
        studyType: "Quiz",
      });
      
      if (result.data && result.data.content && result.data.content.questions) {
        setQuizData({ content: result.data.content });
        setSelectedOptions(
          Array(result.data.content.questions.length).fill(null)
        );
      } else {
        setQuizData({
          content: {
            title: "Sample Quiz",
            questions: [
              {
                question: "Quiz content is not available yet. Please generate it from the course page.",
                options: ["Option 1", "Option 2", "Option 3", "Option 4"],
                answer: "Option 1"
              }
            ]
          }
        });
        setSelectedOptions([null]);
      }
      
      setLoading(false);
    } catch (error) {
      console.log("Note: Quiz data couldn't be loaded:", error.message || "Unknown error");
      setError("Failed to load quiz data. Please try again later.");
      
      setQuizData({
        content: {
          title: "Sample Quiz",
          questions: [
            {
              question: "Quiz content is not available yet. Please generate it from the course page.",
              options: ["Option 1", "Option 2", "Option 3", "Option 4"],
              answer: "Option 1"
            }
          ]
        }
      });
      setSelectedOptions([null]);
      setLoading(false);
    }
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);

    if (quizData?.content?.questions && quizData.content.questions[stepCount]) {
      const correctAnswer = quizData.content.questions[stepCount].answer;
      const isAnswerCorrect = option === correctAnswer;

      setIsCorrect(isAnswerCorrect);

      if (isAnswerCorrect) {
        setScore((prev) => prev + 10);
      }

      const updatedSelectedOptions = [...selectedOptions];
      updatedSelectedOptions[stepCount] = option;
      setSelectedOptions(updatedSelectedOptions);
    } else {
      setIsCorrect(true);
      setScore((prev) => prev + 10);
      
      const updatedSelectedOptions = [...selectedOptions];
      if (updatedSelectedOptions) {
        updatedSelectedOptions[stepCount] = option;
        setSelectedOptions(updatedSelectedOptions);
      }
    }
  };

  const handleTimeout = () => {
    setSelectedOption(null);
    setIsCorrect(false);

    if (selectedOptions && Array.isArray(selectedOptions)) {
      const updatedSelectedOptions = [...selectedOptions];
      
      if (updatedSelectedOptions && stepCount < updatedSelectedOptions.length) {
        updatedSelectedOptions[stepCount] = null;
        setSelectedOptions(updatedSelectedOptions);
      }
    }
  };

  const resetSelection = () => {
    setTimer(15);
    setSelectedOption(null);
    setIsCorrect(null);
  };

  const previousStep = () => {
    if (stepCount > 0) {
      setStepCount((prev) => prev - 1);
      resetSelection();
      
      if (selectedOptions && Array.isArray(selectedOptions) && quizData?.content?.questions) {
        const prevOption = selectedOptions[stepCount - 1];
        setSelectedOption(prevOption);
        
        if (quizData.content.questions[stepCount - 1] && 
            quizData.content.questions[stepCount - 1].answer !== undefined) {
          setIsCorrect(prevOption === quizData.content.questions[stepCount - 1].answer);
        }
      }
    }
  };

  const nextStep = () => {
    if (quizData?.content?.questions && quizData.content.questions.length > stepCount + 1) {
      setStepCount((prev) => prev + 1);
      resetSelection();
      
      if (selectedOptions && Array.isArray(selectedOptions)) {
        const nextOption = selectedOptions[stepCount + 1];
        setSelectedOption(nextOption);
        
        if (quizData.content.questions[stepCount + 1] && 
            quizData.content.questions[stepCount + 1].answer !== undefined) {
          setIsCorrect(
            nextOption === quizData.content.questions[stepCount + 1].answer
          );
        }
      }
    } else {
      setQuizCompleted(true);
    }
  };

  const restartQuiz = () => {
    setStepCount(0);
    setScore(0);
    setSelectedOptions(Array(quizData.content.questions.length).fill(null));
    setQuizCompleted(false);
    resetSelection();
  };

  // Get questions safely
  const questions = quizData?.content?.questions || [];
  const quizTitle = quizData?.content?.title || "Interactive Quiz";

  if (loading) {
    return (
      <StudyPageLayout
        title="Interactive Quiz"
        description="Test your knowledge with this gamified quiz experience"
      >
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner size="lg" text="Loading quiz..." />
        </div>
      </StudyPageLayout>
    );
  }

  if (questions.length === 0) {
    return (
      <StudyPageLayout
        title="Interactive Quiz"
        description="Test your knowledge with this gamified quiz experience"
      >
        <div className="flex flex-col items-center justify-center h-96 text-center">
          <div className="text-gray-600 dark:text-gray-400 mb-4">
            <p className="text-lg font-medium">No quiz questions available</p>
          </div>
          <button
            onClick={() => GetQuiz()}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </StudyPageLayout>
    );
  }

  if (quizCompleted) {
    return (
      <StudyPageLayout
        title="Quiz Complete!"
        description="Congratulations on completing the quiz"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center min-h-[60vh]"
        >
          <ContentCard className="max-w-md w-full text-center">
            <motion.div
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-6"
            >
              <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="text-white" size={32} />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Quiz Completed!
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Great job on completing the quiz!
              </p>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-6 mb-6"
            >
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                {score}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                Total Points
              </div>
              <div className="text-lg font-semibold text-gray-800 dark:text-white mt-2">
                {Math.round((score / (questions.length * 10)) * 100)}% Score
              </div>
            </motion.div>

            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={restartQuiz}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <RotateCcw size={18} />
              Restart Quiz
            </motion.button>
          </ContentCard>
        </motion.div>
      </StudyPageLayout>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      {/* Back Button - Always Visible */}
      <div className="mb-6">
        <Link href={`/course/${courseId}`} replace>
          <button className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
            <ArrowLeft size={16} />
            Back to Course
          </button>
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div className="text-center text-red-600 dark:text-red-400 p-8">
          <p>{error}</p>
        </div>
      ) : (
        <StudyPageLayout
        title="Interactive Quiz"
        description="Test your knowledge with this gamified quiz experience"
      >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Quiz Header */}
        <ContentCard className="mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="text-xl font-bold text-gray-900 dark:text-white">
                Question {stepCount + 1} of {questions.length}
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              {/* Timer */}
              <div className="flex items-center gap-2 px-3 py-1 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <Clock size={18} className="text-red-500 dark:text-red-400" />
                <span className="font-medium text-red-600 dark:text-red-400">
                  {timer}s
                </span>
              </div>
              
              {/* Score */}
              <div className="flex items-center gap-2 px-3 py-1 p-4 hover:shadow-md transition-shadow bg-green-50 dark:bg-green-900/20 rounded-lg">
                <Trophy size={18} className="text-green-500 dark:text-green-400" />
                <span className="font-medium text-green-600 dark:text-green-400">
                  {score} pts
                </span>
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-3">
            <div className="flex w-full gap-1">
              {questions.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full flex-1 transition-all duration-300 ${
                    index < stepCount 
                      ? "bg-green-500" 
                      : index === stepCount 
                      ? "bg-blue-500" 
                      : "bg-gray-300 dark:bg-gray-700"
                  }`}
                />
              ))}
            </div>
          </div>
        </ContentCard>

        {/* Question */}
        <ContentCard className="mb-6 max-w-4xl mx-auto">
          <motion.h2
            key={stepCount}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="text-lg sm:text-xl font-medium text-gray-900 dark:text-white text-center leading-relaxed"
          >
            {questions[stepCount]?.question}
          </motion.h2>
        </ContentCard>

        {/* <ContentCard className="mb-6 max-w-4xl mx-auto">
          
        </ContentCard> */}

        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {questions[stepCount]?.options?.map((option, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                whileHover={{ scale: selectedOption === null && timer > 0 ? 1.02 : 1 }}
                whileTap={{ scale: selectedOption === null && timer > 0 ? 0.98 : 1 }}
                onClick={() => handleOptionClick(option)}
                disabled={selectedOption !== null || timer === 0}
                className={`p-4 rounded-xl text-left font-medium transition-all duration-200 border-2 ${
                  selectedOption === option
                    ? isCorrect
                      ? "bg-green-50 dark:bg-green-900/20 border-green-500 text-green-700 dark:text-green-300"
                      : "bg-red-50 dark:bg-red-900/20 border-red-500 text-red-700 dark:text-red-300"
                    : selectedOption !== null && option === questions[stepCount]?.answer
                    ? "bg-green-50 dark:bg-green-900/20 border-green-500 text-green-700 dark:text-green-300"
                    : "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                } ${
                  (selectedOption !== null || timer === 0) ? "cursor-not-allowed opacity-75" : "cursor-pointer"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedOption === option
                      ? isCorrect
                        ? "border-green-500 bg-green-500"
                        : "border-red-500 bg-red-500"
                      : selectedOption !== null && option === questions[stepCount]?.answer
                      ? "border-green-500 bg-green-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}>
                    {(selectedOption === option && isCorrect) || 
                     (selectedOption !== null && option === questions[stepCount]?.answer) ? (
                      <CheckCircle size={14} className="text-white" />
                    ) : selectedOption === option && !isCorrect ? (
                      <XCircle size={14} className="text-white" />
                    ) : null}
                  </div>
                  <span>{option}</span>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Feedback */}
          <AnimatePresence>
            {selectedOption && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className={`mt-4 p-3 rounded-lg ${
                  isCorrect 
                    ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300" 
                    : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  {isCorrect ? (
                    <CheckCircle size={18} className="text-green-500" />
                  ) : (
                    <XCircle size={18} className="text-red-500" />
                  )}
                  <span className="font-medium">
                    {isCorrect
                      ? "Correct! Well done!"
                      : `Incorrect. The correct answer is: ${questions[stepCount]?.answer}`}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        {/* Navigation */}
        <div className="flex gap-4 items-center justify-between mt-4">
          <button
            onClick={previousStep}
            disabled={stepCount === 0}
            className="flex items-center gap-2 px-6 py-2 border-2 border-gray-300 dark:border-gray-600 
                       text-gray-700 dark:text-gray-300 rounded-lg 
                       hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 
                       disabled:opacity-50 disabled:cursor-not-allowed 
                       transition-all duration-200 font-medium"
          >
            Previous
          </button>
          
          <button
            onClick={nextStep}
            disabled={quizCompleted}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 
                       text-white rounded-lg hover:from-blue-600 hover:to-purple-700 
                       disabled:opacity-50 disabled:cursor-not-allowed 
                       transition-all duration-200 font-medium"
          >
            {stepCount === questions.length - 1 ? "Finish Quiz" : "Next Question"}
          </button>
        </div>
      </motion.div>
        </StudyPageLayout>
      )}
    </div>
  );
}

export default GamifiedQuiz;