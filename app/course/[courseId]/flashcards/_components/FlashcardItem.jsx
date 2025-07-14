import React from 'react';
import ReactCardFlip from 'react-card-flip';
import { motion } from 'framer-motion';

function FlashCardItem({isFlipped, handleClick, flashCard}) {
  return (
    <div className="flex items-center justify-center h-full">
      <ReactCardFlip isFlipped={isFlipped} flipDirection="vertical">
        {/* Front of card */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="p-6 bg-gradient-to-br from-blue-500 to-purple-600 text-white 
                     flex items-center justify-center rounded-xl cursor-pointer 
                     h-[250px] w-[250px] md:h-[300px] md:w-[300px]
                     border border-blue-200 dark:border-blue-700
                     transition-all duration-200"
          onClick={handleClick}
        >
          <div className="text-center">
            <p className="text-lg md:text-xl font-medium leading-relaxed">
              {flashCard.front}
            </p>
            <div className="mt-4 text-sm opacity-75">
              Click to reveal answer
            </div>
          </div>
        </motion.div>
        
        {/* Back of card */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="p-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-white 
                     flex items-center justify-center rounded-xl cursor-pointer 
                     h-[250px] w-[250px] md:h-[300px] md:w-[300px]
                     border-2 border-blue-500 dark:border-blue-400
                     transition-all duration-200"
          onClick={handleClick}
        >
          <div className="text-center">
            <p className="text-lg md:text-xl font-medium leading-relaxed text-gray-800 dark:text-gray-200">
              {flashCard.back}
            </p>
            <div className="mt-4 text-sm text-blue-600 dark:text-blue-400">
              Click to flip back
            </div>
          </div>
        </motion.div>
      </ReactCardFlip>
    </div>
  );
}

export default FlashCardItem