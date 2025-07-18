"use client";
import { UserButton } from '@clerk/nextjs';
import { useUser } from "@clerk/nextjs";
import React, { useState, useEffect } from 'react';
import { Bell, Menu, Search, X, Moon, Sun } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';

function DashboardHeader() {
  const { user } = useUser();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  
  // Handle theme toggle
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };
  
  // Handle component mount - this ensures we only show theme toggle after hydration
  // to avoid hydration mismatch errors
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className='sticky top-0 z-30 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md py-4 px-6 border-b border-gray-100 dark:border-gray-800 shadow-sm'>
      <div className='flex items-center justify-between'>
        {/* Mobile menu trigger */}
        <button 
          className="md:hidden text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Search bar */}
        <div className='hidden md:flex items-center flex-1 max-w-md relative'>
          <div className='relative w-full'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300' size={18} />
            <input 
              type="text" 
              placeholder='Search courses, topics...'
              className='w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 dark:placeholder-gray-300'
            />
          </div>
        </div>
        
        {/* Right side actions */}
        <div className='flex items-center gap-3'>
          {/* Theme toggle */}
          {mounted && (
            <button 
              onClick={toggleTheme}
              className='p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors'
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={20} className="text-gray-200" /> : <Moon size={20} />}
            </button>
          )}

          {/* Notifications */}
          <button className='relative p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg'>
            <Bell size={20} />
            <span className='absolute top-0.5 right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full'></span>
          </button>
          
          {/* Greeting & User Button */}
          <div className='hidden md:flex items-center gap-3 ml-3'>
            <div className='text-right'>
              <p className='text-sm text-gray-600 dark:text-gray-300'>Welcome back,</p>
              <p className='font-semibold text-gray-800 dark:text-gray-100'>{user?.firstName || 'Student'}</p>
            </div>
            <UserButton 
              afterSignOutUrl='/'
              appearance={{
                elements: {
                  userButtonAvatarBox: "w-10 h-10",
                  userButtonPopoverCard: {
                    backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                    borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
                    color: theme === 'dark' ? '#f3f4f6' : '#374151',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)'
                  },
                  userButtonPopoverActionButton: {
                    color: theme === 'dark' ? '#e5e7eb' : '#374151',
                    '&:hover': {
                      backgroundColor: theme === 'dark' ? '#374151' : '#f3f4f6'
                    }
                  },
                  userButtonPopoverActionButtonText: {
                    color: theme === 'dark' ? '#e5e7eb' : '#374151'
                  },
                  userButtonPopoverActionButtonIcon: {
                    color: theme === 'dark' ? '#9ca3af' : '#6b7280'
                  },
                  userButtonPopoverFooter: {
                    backgroundColor: theme === 'dark' ? '#1f2937' : '#f9fafb',
                    borderTopColor: theme === 'dark' ? '#374151' : '#e5e7eb'
                  }
                },
                variables: {
                  colorBackground: theme === 'dark' ? '#1f2937' : '#ffffff',
                  colorText: theme === 'dark' ? '#f3f4f6' : '#374151',
                  colorPrimary: '#3b82f6',
                  colorInputBackground: theme === 'dark' ? '#374151' : '#f9fafb',
                  colorInputText: theme === 'dark' ? '#f3f4f6' : '#374151',
                  borderRadius: '0.75rem'
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {showMobileMenu && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className='md:hidden fixed inset-x-0 top-16 bg-white dark:bg-gray-900 shadow-lg dark:shadow-gray-900 rounded-b-xl p-4 border border-gray-100 dark:border-gray-800 z-50'
        >
          <div className='space-y-4'>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300' size={18} />
              <input 
                type="text" 
                placeholder='Search courses, topics...'
                className='w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 dark:placeholder-gray-300'
              />
            </div>
            
            <nav className='space-y-2'>
              <Link href="/dashboard">
                <div className='p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg text-gray-800 dark:text-gray-200'>Dashboard</div>
              </Link>
              <Link href="/dashboard/mathai">
                <div className='p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg flex justify-between items-center text-gray-800 dark:text-gray-200'>
                  <span>MathAI</span>
                  <span className="bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs px-2 py-0.5 rounded-full flex items-center">New</span>
                </div>
              </Link>
              <Link href="/dashboard/profile">
                <div className='p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg text-gray-800 dark:text-gray-200'>Profile</div>
              </Link>
              <div className='border-t border-gray-100 pt-2 my-2'></div>
              <Link href="/create">
                <div className='p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg text-center font-medium'>
                  Create New Course
                </div>
              </Link>
            </nav>
          </div>
        </motion.div>
      )}
    </header>
  );
}

export default DashboardHeader;