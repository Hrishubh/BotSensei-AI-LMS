"use client";

import { useUser } from "@clerk/nextjs";
import axios from "axios";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { ThemeProvider } from "next-themes";
import HydrationFix from "../components/HydrationFix";

function Provider({ children }) {
  const { user } = useUser();
  const [isProcessingUser, setIsProcessingUser] = useState(false);
  const debounceTimerRef = useRef(null);

  // Debounced user check
  const debouncedCheckUser = useCallback((userData) => {
    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer
    debounceTimerRef.current = setTimeout(() => {
      CheckIsNewUser(userData);
    }, 2000); // 2 second debounce
  }, []);

  useEffect(() => {
    if (user) {
      debouncedCheckUser(user);
    }

    // Cleanup on unmount
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [user, debouncedCheckUser]);

  const CheckIsNewUser = async (userData = user) => {
    if (!userData?.primaryEmailAddress?.emailAddress) return;
    
    // Check if user was already processed this session
    const userProcessedKey = `user_processed_${userData.primaryEmailAddress.emailAddress}`;
    if (sessionStorage.getItem(userProcessedKey)) {
      console.log("User already processed this session");
      return;
    }
    
    // Prevent overlapping requests
    if (isProcessingUser) {
      console.log("User creation already in progress");
      return;
    }
    
    try {
      setIsProcessingUser(true);
      
      // Check existence first
      const existsResponse = await axios.get(`/api/user-exists?email=${userData.primaryEmailAddress.emailAddress}`);
      
      if (existsResponse.data.exists) {
        sessionStorage.setItem(userProcessedKey, 'true');
        console.log("User already exists in database");
        setIsProcessingUser(false);
        return;
      }

      // Create user if doesn't exist
      const resp = await axios.post('/api/create-user', {
        user: {
          fullName: userData.fullName,
          email: userData.primaryEmailAddress.emailAddress
        }
      });
      
      // Mark user as processed
      sessionStorage.setItem(userProcessedKey, 'true');
      console.log("User check/creation response:", resp.data);
    } catch (error) {
      console.log("Note: User creation will be tried again on next login", error.message || "");
    } finally {
      setIsProcessingUser(false);
    }
  };

  return (
    <ThemeProvider 
      attribute="class" 
      defaultTheme="system" 
      enableSystem={true}
      enableColorScheme={true}
      storageKey="BotSensei-theme"
      disableTransitionOnChange={false}
    >
      {/* Add HydrationFix component to clean up fdprocessedid attributes */}
      <HydrationFix />
      {children}
    </ThemeProvider>
  );
}

export default Provider;
