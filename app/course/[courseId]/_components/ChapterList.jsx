import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ChevronRight, Clock, Users } from 'lucide-react';

function ChapterList({ course }) {
    const CHAPTERS = course.courseLayout.chapters;
    console.log(CHAPTERS);
    
    // Function to get gradient colors for each chapter
    const getChapterGradient = (index) => {
        const gradients = [
            "from-blue-500 to-blue-600",
            "from-purple-500 to-purple-600", 
            "from-green-500 to-green-600",
            "from-amber-500 to-amber-600",
            "from-red-500 to-red-600",
            "from-indigo-500 to-indigo-600",
            "from-pink-500 to-pink-600",
            "from-teal-500 to-teal-600"
        ];
        return gradients[index % gradients.length];
    };
    
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-xl text-gray-900 dark:text-white">Course Chapters</h2>
                <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <BookOpen size={16} className="text-blue-600 dark:text-blue-400" />
                    <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                        {CHAPTERS.length} Chapters
                    </span>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {CHAPTERS.map((chapter, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        whileHover={{ y: -2 }}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer group"
                    >
                        {/* Colored header */}
                        <div className={`h-2 bg-gradient-to-r ${getChapterGradient(index)}`}></div>
                        
                        <div className="p-5">
                            {/* Chapter header */}
                            <div className="flex items-start gap-4 mb-4">
                                <div className="flex items-center gap-3">
                                    <span className="text-3xl">{chapter.emoji}</span>
                                    <div className="flex items-center gap-2 px-2 py-1 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                                            Chapter {index + 1}
                                        </span>
                                    </div>
                                </div>
                                {/* <ChevronRight 
                                    size={20} 
                                    className="text-gray-400 dark:text-gray-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors ml-auto mt-1" 
                                /> */}
                            </div>
                            
                            {/* Chapter content */}
                            <div className="mb-4">
                                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 line-clamp-2">
                                    {chapter.chapterTitle}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3">
                                    {chapter.chapterSummary}
                                </p>
                            </div>
                            
                            {/* Chapter metadata */}
                            {/* <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1">
                                        <BookOpen size={12} />
                                        <span>{chapter.topics?.length || 0} Topics</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock size={12} />
                                        <span>{((index + 1) * 3 + 8)} min read</span>
                                    </div>
                                </div>
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            </div> */}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

export default ChapterList