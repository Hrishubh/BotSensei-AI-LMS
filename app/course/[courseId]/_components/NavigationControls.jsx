"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function NavigationControls({ 
  currentStep, 
  totalSteps, 
  onPrevious, 
  onNext, 
  disablePrevious, 
  disableNext,
  className = ""
}) {
  return (
    <div className={`flex flex-col sm:flex-row items-center gap-2 sm:gap-5 mb-5 ${className}`}>
      <button
        onClick={onPrevious}
        disabled={disablePrevious}
        className="flex items-center justify-center pr-1 py-2 min-w-[100px] border-2 border-blue-500 
                   text-blue-600 dark:text-blue-400 rounded-lg 
                   hover:bg-blue-50 dark:hover:bg-blue-900/20 
                   disabled:opacity-50 disabled:cursor-not-allowed 
                   transition-all duration-200 font-medium"
      >
        <ChevronLeft size={16} />
        Previous
      </button>

      {/* Progress Bar */}
      <div className="flex w-full gap-1 sm:gap-2 my-2 sm:my-0">
        {Array.from({ length: totalSteps }, (_, index) => (
          <motion.div
            key={index}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            className={`w-full h-2 rounded-full transition-all duration-300 ${
              index <= currentStep 
                ? "bg-gradient-to-r from-blue-500 to-purple-600" 
                : "bg-gray-300 dark:bg-gray-700"
            }`}
          />
        ))}
      </div>

      <button
        onClick={onNext}
        disabled={disableNext}
        className="flex items-center justify-center pl-1 py-2 min-w-[70px] border-2 border-blue-500 
                   text-blue-600 dark:text-blue-400 rounded-lg 
                   hover:bg-blue-50 dark:hover:bg-blue-900/20 
                   disabled:opacity-50 disabled:cursor-not-allowed 
                   transition-all duration-200 font-medium"
      >
        Next
        <ChevronRight size={16} />
      </button>
    </div>
  );
}