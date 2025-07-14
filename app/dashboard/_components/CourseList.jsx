"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import CourseCardItem from "./CourseCardItem";
import { motion } from "framer-motion";
import { BookOpen, ChevronRight, Search, Filter } from "lucide-react";
import Link from "next/link";

function CourseList() {
  const { user } = useUser();
  const [courseList, setCourseList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const GetCourseList = useCallback(async () => {
    try {
      const result = await axios.post("/api/courses/", {
        createdBy: user?.primaryEmailAddress?.emailAddress,
      });
      setCourseList(result.data.result);
      console.log(result.data.result) // Assuming the API returns `courses` array
    } catch (err) {
      console.error("Error fetching course list:", err.message);
      setError("Failed to load courses. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [user?.primaryEmailAddress?.emailAddress]);

  useEffect(() => {
    if (user) {
      GetCourseList();
    }
  }, [user, GetCourseList]);

  // Auto-refresh courses when there are generating courses
  useEffect(() => {
    if (user && courseList.length > 0) {
      // Check if any courses are still generating
      const hasGeneratingCourses = courseList.some(course => course.status === "Generating");
      
      if (hasGeneratingCourses) {
        console.log("Found generating courses, starting polling...");
        // Poll every 3 seconds if there are generating courses
        const interval = setInterval(() => {
          console.log("Polling for course status updates...");
          GetCourseList();
        }, 3000);
        
        return () => {
          console.log("Stopping course status polling");
          clearInterval(interval);
        };
      }
    }
  }, [user, courseList, GetCourseList]);

  if (loading) {
    return (
      <div className="mt-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-bold text-2xl text-gray-900 dark:text-white">Your Study Materials</h2>
        </div>
        <div className="flex items-center justify-center h-40">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 border-r-purple-500 border-b-green-500 border-l-amber-500 animate-spin"></div>
            <div className="absolute inset-3 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center">
              <BookOpen className="text-blue-600 dark:text-blue-400 h-6 w-6" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-10 p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400">
        <h3 className="font-medium mb-2">Error Loading Courses</h3>
        <p>{error}</p>
        <button 
          onClick={() => {setLoading(true); GetCourseList();}}
          className="mt-2 bg-red-100 dark:bg-red-800 hover:bg-red-200 dark:hover:bg-red-700 text-red-700 dark:text-red-200 px-4 py-2 rounded-lg text-sm"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="mt-10"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="font-bold text-2xl text-gray-900 dark:text-white">Your Study Materials</h2>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300" size={18} />
            <input 
              type="text" 
              placeholder="Search your materials..." 
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 dark:placeholder-gray-300"
            />
          </div>
          
          <Link href="/dashboard/courses" className="whitespace-nowrap">
            <button className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-lg flex items-center gap-1 hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-colors">
              View All <ChevronRight size={16} />
            </button>
          </Link>
        </div>
      </div>
      
      {courseList.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {courseList.map((course, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 * (index % 4) }}
            >
              <CourseCardItem course={course} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <div className="mx-auto w-20 h-20 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-4">
            <BookOpen size={32} className="text-blue-500 dark:text-blue-400" />
          </div>
          <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">No study materials yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Create your first course to get started</p>
          <Link href="/create">
            <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2.5 rounded-lg hover:opacity-90 transition-opacity">
              Create Course
            </button>
          </Link>
        </div>
      )}
    </motion.div>
  );
}

export default CourseList;
