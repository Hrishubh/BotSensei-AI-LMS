"use client";

import { SignIn } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Page() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-screen flex justify-center items-center bg-white dark:bg-gray-900">
        <div className="animate-pulse">
          <div className="w-96 h-96 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex justify-center items-center bg-white dark:bg-gray-900">
      <SignIn 
        appearance={{
          baseTheme: theme === 'dark' ? 'dark' : 'light',
          variables: {
            colorBackground: theme === 'dark' ? '#1f2937' : '#ffffff',
            colorText: theme === 'dark' ? '#f3f4f6' : '#374151',
            colorPrimary: '#3b82f6',
            colorInputBackground: theme === 'dark' ? '#374151' : '#ffffff',
            colorInputText: theme === 'dark' ? '#f3f4f6' : '#374151',
            borderRadius: '0.75rem',
            fontFamily: 'inherit'
          },
          elements: {
            card: {
              backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
              borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)'
            },
            headerTitle: {
              color: theme === 'dark' ? '#f3f4f6' : '#374151'
            },
            headerSubtitle: {
              color: theme === 'dark' ? '#d1d5db' : '#6b7280'
            },
            socialButtonsBlockButton: {
              backgroundColor: theme === 'dark' ? '#374151' : '#f9fafb',
              borderColor: theme === 'dark' ? '#4b5563' : '#d1d5db',
              color: theme === 'dark' ? '#f3f4f6' : '#374151',
              '&:hover': {
                backgroundColor: theme === 'dark' ? '#4b5563' : '#f3f4f6'
              }
            },
            formFieldLabel: {
              color: theme === 'dark' ? '#f3f4f6' : '#374151'
            },
            formFieldInput: {
              backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
              borderColor: theme === 'dark' ? '#4b5563' : '#d1d5db',
              color: theme === 'dark' ? '#f3f4f6' : '#374151',
              '&:focus': {
                borderColor: '#3b82f6',
                boxShadow: '0 0 0 1px #3b82f6'
              }
            },
            footerActionLink: {
              color: theme === 'dark' ? '#60a5fa' : '#3b82f6'
            },
            footerActionText: {
              color: theme === 'dark' ? '#d1d5db' : '#6b7280'
            },
            dividerLine: {
              backgroundColor: theme === 'dark' ? '#4b5563' : '#e5e7eb'
            },
            dividerText: {
              color: theme === 'dark' ? '#9ca3af' : '#6b7280'
            }
          }
        }}
      />
    </div>
  );
}
