import React from "react";
import { motion } from "framer-motion";
import { BookOpen, GraduationCap } from "lucide-react";

function CourseIntroCard({ course }) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex flex-col sm:flex-row gap-6 items-center">
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
            <GraduationCap className="text-white" size={32} />
          </div>
          <div className="flex items-center gap-2 px-1 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            {/* <BookOpen size={14} className="text-blue-600 dark:text-blue-400" /> */}
            <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">
              {course.courseLayout.chapters.length} Chapters
            </span>
          </div>
        </div>

        <div className="flex flex-col justify-between w-full text-center sm:text-left">
          <h1 className="font-bold text-2xl text-gray-900 dark:text-white mb-3">
            {course.courseLayout.courseTitle}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            {course.courseLayout.courseSummary}
          </p>
          
          {/* Course Metadata */}
          <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>Course Type: {course.courseType}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span>Difficulty: {course.difficultyLevel}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default CourseIntroCard;
