// StudyMaterialSection Component
import React, { useEffect, useState } from "react";
import MaterialCardItem from "./MaterialCardItem";
import axios from "axios";
import Link from "next/link";
import { useGenerationStatus } from "../../../../hooks/useGenerationStatus";
import { Loader } from "lucide-react";

function StudyMaterialSection({ courseId, course }) {
  const { isGenerating, statuses, loading: statusLoading } = useGenerationStatus(courseId);
  const [studyTypeContent, setStudyTypeContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMaterials, setShowMaterials] = useState(false);

  const MaterialList = [
    {
      name: "Notes / Chapters",
      desc: "Read notes to prepare it",
      icon: "/notes.png",
      path: "/notes",
      type: "notes",
    },
    {
      name: "Flashcard",
      desc: "Flashcard to help remember concepts",
      icon: "/flashcard.png",
      path: "/flashcards",
      type: "flashcard",
    },
    {
      name: "Quiz",
      desc: "Great way to test your knowledge",
      icon: "/quiz.png",
      path: "/quiz",
      type: "quiz",
    },
    {
      name: "Question/Answer",
      desc: "Help to practice your learning",
      icon: "/qa.png",
      path: "/qa",
      type: "qa",
    },
  ];

  const GetStudyMaterial = async () => {
    try {
      const result = await axios.post("/api/study-type", {
        courseId: courseId,
        studyType: "ALL",
      });
      console.log("GetStudyMaterial", result.data);
      setStudyTypeContent(result.data);
    } catch (err) {
      console.error("Error fetching study material:", err);
      setError("Failed to load study material.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) {
      GetStudyMaterial();
    }
  }, [courseId]);

  // Control when to show materials - wait for BOTH data AND status to be ready
  useEffect(() => {
    if (!loading && !statusLoading) {
      // Add a small delay to ensure status has fully propagated
      const timer = setTimeout(() => {
        setShowMaterials(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [loading, statusLoading]);

  // Show loading state until everything is ready
  if (loading || statusLoading || !showMaterials) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <h2 className="font-bold text-xl text-gray-900 dark:text-white mb-4">Study Materials</h2>
        <div className="flex flex-col items-center justify-center h-40 space-y-4">
          <div className="relative">
            <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 bg-blue-500 rounded-full animate-pulse"></div>
            </div>
          </div>
          <div className="text-center">
            <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {loading ? "Loading Study Materials" : statusLoading ? "Loading Status Updates" : "Preparing Study Materials"}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {loading ? "Fetching your learning content..." : statusLoading ? "Getting latest material status..." : "Getting everything ready for you..."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <h2 className="font-bold text-xl text-gray-900 dark:text-white mb-4">Study Materials</h2>
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 font-medium mb-4">{error}</p>
          <button
            onClick={() => GetStudyMaterial()}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-bold text-xl text-gray-900 dark:text-white">Study Materials</h2>
        {isGenerating && (
          <div className="flex items-center gap-2 px-3 py-1 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <Loader className="animate-spin w-4 h-4 text-yellow-600" />
            <span className="text-sm text-yellow-600 dark:text-yellow-400">Generating Materials</span>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 gap-4">
        {MaterialList.map((item, index) => (
          <div 
            key={index}
            className="animate-in slide-in-from-bottom-4 fade-in duration-500"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <MaterialCardItem
              item={item}
              course={course}
              refreshData={GetStudyMaterial}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default StudyMaterialSection;
