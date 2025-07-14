"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import StudyPageLayout from "./_components/StudyPageLayout";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";
import { ArrowLeft } from "lucide-react";
import CourseIntroCard from "./_components/CourseIntroCard";
import StudyMaterialSection from "./_components/StudyMaterialSection";
import ChapterList from "./_components/ChapterList";

function Course() {
  const { courseId } = useParams();
  const router = useRouter();
  const [courseData, setCourseData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const GetCourse = async () => {
    try {
      setLoading(true);
      const result = await axios.get(`/api/courses?courseId=${courseId}`);
      console.log(result.data.result);
      setCourseData(result.data.result);
    } catch (err) {
      console.error("Error fetching course:", err.message);
      setError("Failed to load course data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) {
      GetCourse();
    }
  }, [courseId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
          >
            <ArrowLeft size={16} />
            Back
          </button>
        </div>
        <StudyPageLayout
          title="Course Overview"
          description="Explore your personalized learning materials"
        >
          <div className="flex items-center justify-center h-96">
            <LoadingSpinner size="lg" text="Loading course details..." />
          </div>
        </StudyPageLayout>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
          >
            <ArrowLeft size={16} />
            Back
          </button>
        </div>
        <StudyPageLayout
          title="Course Overview"
          description="Explore your personalized learning materials"
        >
          <div className="flex flex-col items-center justify-center h-96 text-center">
            <div className="text-red-600 dark:text-red-400 mb-4">
              <p className="text-lg font-medium">{error}</p>
            </div>
            <button
              onClick={() => GetCourse()}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </StudyPageLayout>
      </div>
    );
  }

  if (!courseData) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
          >
            <ArrowLeft size={16} />
            Back
          </button>
        </div>
        <StudyPageLayout
          title="Course Overview"
          description="Explore your personalized learning materials"
        >
          <div className="flex items-center justify-center h-96">
            <p className="text-gray-600 dark:text-gray-300">No course data available</p>
          </div>
        </StudyPageLayout>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      {/* Back Button - Always Visible */}
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </div>

      <StudyPageLayout
        title="Course Overview"
        description="Explore your personalized learning materials"
      >
        <div className="space-y-8">
          <CourseIntroCard course={courseData} />
          <StudyMaterialSection courseId={courseId} course={courseData}/>
          <ChapterList course={courseData} />
        </div>
      </StudyPageLayout>
    </div>
  );
}

export default Course;