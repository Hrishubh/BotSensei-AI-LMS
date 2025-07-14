"use client"

import { useUser } from '@clerk/nextjs';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, GraduationCap } from 'lucide-react';

function WelcomeBanner() {
    const { user } = useUser();
    const [mounted, setMounted] = useState(false);
    const [formattedDate, setFormattedDate] = useState('');
    
    useEffect(() => {
        setMounted(true);
        // Get current date only on client side
        const today = new Date();
        const options = { weekday: 'long', month: 'long', day: 'numeric' };
        setFormattedDate(today.toLocaleDateString('en-US', options));
    }, []);
    
    return (
        <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className='relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
        >
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                <div className="absolute top-10 right-10 w-64 h-64 bg-white opacity-5 rounded-full blur-2xl"></div>
                <div className="absolute bottom-10 left-10 w-48 h-48 bg-purple-300 opacity-10 rounded-full blur-2xl"></div>
            </div>
            
            <div className='relative z-10 p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start justify-between gap-6'>
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                    <div className="p-4 bg-white/20 backdrop-blur-sm rounded-xl hidden md:block">
                        <GraduationCap size={48} />
                    </div>
                    
                    <div className="text-center md:text-left">
                        <h2 className='font-bold text-2xl md:text-3xl'>Hello, {user?.firstName || 'Student'}</h2>
                        <p className="mt-2 text-white/80 max-w-md">Welcome back to your personalized learning journey. Ready to expand your knowledge today?</p>
                    </div>
                </div>
                
                <div className="hidden md:block">
                    {mounted && (
                        <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg">
                            <Calendar size={18} />
                            <span>{formattedDate}</span>
                        </div>
                    )}
                    
                    <div className="mt-4 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg text-center">
                        <p className="text-sm font-medium">Today's Goal</p>
                        <p className="text-lg font-medium">Complete 2 lessons</p>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

export default WelcomeBanner