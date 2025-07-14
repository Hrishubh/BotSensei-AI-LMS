"use client";

import React from 'react';
import { motion } from 'framer-motion';

export default function ContentCard({ 
  children, 
  className = "",
  animate = true,
  delay = 0 
}) {
  const cardContent = (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm 
                    border border-gray-100 dark:border-gray-700 
                    p-4 hover:shadow-md transition-shadow duration-200 ${className}`}>
      {children}
    </div>
  );

  if (!animate) {
    return cardContent;
  }

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -2 }}
    >
      {cardContent}
    </motion.div>
  );
}