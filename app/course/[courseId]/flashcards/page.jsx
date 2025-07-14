"use client";

import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation } from "swiper/modules";
import { motion } from "framer-motion";
import FlashcardItem from "./_components/FlashcardItem";
import StudyPageLayout from "../_components/StudyPageLayout";
import LoadingSpinner from "../../../../components/ui/LoadingSpinner";
import { ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";

function Flashcards() {
  const { courseId } = useParams();
  const router = useRouter();
  const [flashCards, setFlashCards] = useState([]);
  const [flippedStates, setFlippedStates] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    GetFlashCards();
  }, []);

  const GetFlashCards = async () => {
    try {
      setLoading(true);
      const result = await axios.post("/api/study-type", {
        courseId: courseId,
        studyType: "Flashcard",
      });
      setFlashCards(result.data);
      console.log("Flashcard", result.data);
    } catch (err) {
      console.error("Error fetching flashcards:", err.message);
      setError("Failed to load flashcards. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleClick = (index) => {
    setFlippedStates((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  if (loading) {
    return (
      <StudyPageLayout
        title="Flashcards"
        description="Help you to remember your concepts"
      >
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner size="lg" text="Loading flashcards..." />
        </div>
      </StudyPageLayout>
    );
  }

  if (error) {
    return (
      <StudyPageLayout
        title="Flashcards"
        description="Help you to remember your concepts"
      >
        <div className="flex flex-col items-center justify-center h-96 text-center">
          <div className="text-red-600 dark:text-red-400 mb-4">
            <p className="text-lg font-medium">{error}</p>
          </div>
          <button
            onClick={() => GetFlashCards()}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
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
        title="Flashcards"
        description="Help you to remember your concepts"
      >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className=""
      >
        {/* Swiper Container with Tailwind Styling */}
        <div className="relative w-full h-[30vh] min-h-[400px] max-w-6xl mx-auto">
          <Swiper
            slidesPerView={1}
            spaceBetween={30}
            loop={false}
            pagination={{ 
              clickable: true,
              bulletClass: 'swiper-pagination-bullet !bg-blue-500 dark:!bg-blue-400',
              bulletActiveClass: 'swiper-pagination-bullet-active !bg-purple-600 dark:!bg-purple-400'
            }}
            navigation={{
              prevEl: '.custom-swiper-button-prev',
              nextEl: '.custom-swiper-button-next',
            }}
            modules={[Pagination, Navigation]}
            className="w-full h-full rounded-xl overflow-hidden"
          >
            {flashCards.content?.map((flashCard, index) => (
              <SwiperSlide key={index} className="flex items-center justify-center">
                <FlashcardItem
                  isFlipped={flippedStates[index] || false}
                  handleClick={() => handleClick(index)}
                  flashCard={flashCard}
                />
              </SwiperSlide>
            ))}
            {(!flashCards.content || flashCards.content?.length === 0) && (
              <SwiperSlide className="flex items-center justify-center">
                <div className="p-8 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 
                               flex flex-col items-center justify-center rounded-xl
                               border border-gray-200 dark:border-gray-700 
                               h-[300px] w-[280px] md:h-[400px] md:w-[350px]">
                  <p className="text-lg font-medium text-center">
                    No flashcards available yet
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
                    Generate flashcards from the course page
                  </p>
                </div>
              </SwiperSlide>
            )}
          </Swiper>
          
          {/* Custom Navigation Buttons */}
          <button className="custom-swiper-button-prev absolute left-4 top-1/2 transform -translate-y-1/2 
                             bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 
                             w-12 h-12 rounded-full shadow-lg hover:shadow-xl 
                             transition-all duration-200 hover:scale-110 z-10
                             flex items-center justify-center
                             border border-gray-200 dark:border-gray-700">
            <ChevronLeft size={20} />
          </button>
          
          <button className="custom-swiper-button-next absolute right-4 top-1/2 transform -translate-y-1/2 
                             bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 
                             w-12 h-12 rounded-full shadow-lg hover:shadow-xl 
                             transition-all duration-200 hover:scale-110 z-10
                             flex items-center justify-center
                             border border-gray-200 dark:border-gray-700">
            <ChevronRight size={20} />
          </button>
        </div>
        
        {/* Flashcard Counter */}
        {flashCards.content && flashCards.content.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-3"
          >
            <p className="text-gray-600 dark:text-gray-300">
              {flashCards.content.length} flashcard{flashCards.content.length !== 1 ? 's' : ''} available
            </p>
          </motion.div>
        )}
      </motion.div>
        </StudyPageLayout>
      )}
    </div>
  );
}

export default Flashcards;
