import { useState, useEffect, useCallback } from 'react';

export const useGenerationStatus = (courseId) => {
  const [statuses, setStatuses] = useState({
    notes: 'Ready',
    flashcard: 'Not Generated',
    quiz: 'Not Generated', 
    qa: 'Not Generated'
  });
  const [loading, setLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const fetchStatus = useCallback(async () => {
    if (!courseId) return;
    
    try {
      const response = await fetch(`/api/generation-status?courseId=${courseId}`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setStatuses(prevStatuses => ({
        ...prevStatuses,
        ...data
      }));
      
      // Only set loading to false after initial load
      if (isInitialLoad) {
        setIsInitialLoad(false);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching generation status:', error);
      if (isInitialLoad) {
        setIsInitialLoad(false);
        setLoading(false);
      }
    }
  }, [courseId, isInitialLoad]);

  // Check if any content is still generating
  const hasGeneratingContent = Object.values(statuses).some(
    status => status === 'Generating'
  );

  // Optimized polling: Poll every 1.5 seconds if generating, otherwise every 5 seconds
  useEffect(() => {
    fetchStatus(); // Initial fetch

    const pollInterval = hasGeneratingContent ? 1500 : 5000;
    const interval = setInterval(fetchStatus, pollInterval);
    
    return () => clearInterval(interval);
  }, [fetchStatus, hasGeneratingContent]);

  return { 
    statuses, 
    loading, 
    refetch: fetchStatus,
    isGenerating: hasGeneratingContent
  };
};