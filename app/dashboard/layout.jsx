"use client";

import React, { useState, useEffect } from 'react'
import { useTheme } from "next-themes";
import SideBar from './_components/SideBar'
import DashboardHeader from './_components/DashboardHeader'

function DashboardLayout({children}) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className='min-h-screen bg-gray-50'>
        <div className='md:w-72 hidden md:block fixed h-full shadow-lg z-10'>
          <div className="flex flex-col h-full p-6 bg-white">
            <div className="animate-pulse space-y-4">
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="space-y-2">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-8 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className='md:ml-72'>
          <div className="h-16 bg-white border-b border-gray-100"></div>
          <div className='p-6 md:p-10 max-w-[1500px] mx-auto'>
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <div className='md:w-72 hidden md:block fixed h-full shadow-lg dark:shadow-gray-900 z-10'>
        <SideBar />
      </div>
      <div className='md:ml-72'>
        <DashboardHeader />
        <div className='p-6 md:p-10 max-w-[1500px] mx-auto'>
            {children}
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout