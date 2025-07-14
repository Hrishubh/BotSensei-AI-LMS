"use client";

import React from 'react';
import { motion } from 'framer-motion';
import NavigationControls from './NavigationControls';

export default function StudyPageLayout({ 
  title, 
  description, 
  children,
  showNavigation = false,
  navigationProps = {},
  className = ""
}) {
  return (
    <div className={`min-h-[83vh] bg-white dark:bg-gray-900 ${className}`}>
      <div className="px-4 sm:px-6 space-y-4">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {title}
          </h1>
          {description && (
            <p className="text-gray-600 dark:text-gray-300">
              {description}
            </p>
          )}
        </motion.div>

        {/* Navigation */}
        {showNavigation && <NavigationControls {...navigationProps} />}

        {/* Content Area with Card Outline */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-6"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}