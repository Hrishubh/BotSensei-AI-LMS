import axios from "axios";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Loader } from "lucide-react";
import { useGenerationStatus } from "../../../../hooks/useGenerationStatus";

function MaterialCardItem({ item, course, refreshData }) {
  const { statuses, refetch } = useGenerationStatus(course.courseId);
  const [localLoading, setLocalLoading] = useState(false);

  // Get status from database instead of local state
  const getTypeKey = () => {
    if (item.type === 'notes') return 'notes';
    if (item.type === 'flashcard') return 'flashcard';
    if (item.type === 'quiz') return 'quiz';
    if (item.type === 'qa') return 'qa';
    return null;
  };

  const dbStatus = statuses[getTypeKey()];
  const isContentReady = dbStatus === 'Ready';
  const isCurrentItemGenerating = dbStatus === 'Generating';

  // Reset localLoading when content becomes ready or when generation status changes
  useEffect(() => {
    if (isContentReady || isCurrentItemGenerating) {
      setLocalLoading(false);
    }
  }, [isContentReady, isCurrentItemGenerating]);

  // Function to generate chapters string
  const getChapters = () => {
    if (!course?.courseLayout?.chapters) return ""; // Handle empty or undefined course layout
    return course.courseLayout.chapters
      .map((chapter) => chapter.chapterTitle)
      .join(", "); // Return as a comma-separated string
  };

  // Generate content for the material type (simplified)
  const GenerateContent = async (e) => {
    e.preventDefault();

    // Get chapters for the course
    const chapters = getChapters();
    console.log("Chapters:", chapters);

    try {
      setLocalLoading(true);
      await axios.post("/api/study-type-content", {
        courseId: course.courseId,
        type: item.name,
        chapter: chapters,
      });
      
      console.log("Generated content for type:", item.name);
      console.log("Content generation initiated.");
      
      // Immediately check status after a short delay
      setTimeout(() => refetch(), 1000);
      
      // Also refresh parent data if function exists
      if (refreshData) {
        refreshData();
      }
      
      // Don't set localLoading to false here - let the status polling handle it
      // The loader will continue showing until the actual generation is complete
    } catch (error) {
      console.error("Error generating content:", error);
      // Only set localLoading to false on error
      setLocalLoading(false);
    }
    // Remove the finally block that was causing the premature loader stop
  };

  // Button state logic
  const getButtonConfig = () => {
    if (isContentReady) {
      return { text: "View Content", disabled: false, loading: false, variant: "ready" };
    }
    if (isCurrentItemGenerating || localLoading) {
      return { text: "Generating", disabled: true, loading: true, variant: "generating" };
    }
    // Removed the bottleneck: Allow parallel generation
    // if (isAnyGenerating) {
    //   return { text: "Another item generating", disabled: true, loading: false, variant: "disabled" };
    // }
    return { text: "Generate", disabled: false, loading: false, variant: "generate" };
  };

  const buttonConfig = getButtonConfig();

  return (
    <Link href={`/course/${course.courseId}${item.path}`}>
      <div
        className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm rounded-xl 
                   p-4 h-full flex flex-col items-center justify-between gap-3 
                   hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600 
                   transition-all duration-200 ${
          !isContentReady ? "grayscale opacity-75" : ""
        }`}
      >
        {/* Status Badge */}
        <div className="flex items-center justify-between w-full">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              isContentReady
                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                : isCurrentItemGenerating
                ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
                : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
            }`}
          >
            {isContentReady 
              ? "Ready" 
              : isCurrentItemGenerating 
              ? "Generating" 
              : "Generate"}
          </span>
        </div>
        
        {/* Content */}
        <div className="flex flex-col items-center gap-3 flex-1">
          <img src={item.icon} alt={item.name} width={48} height={48} className="object-contain" />
          <div className="text-center">
            <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-1">{item.name}</h3>
            <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed">{item.desc}</p>
          </div>
        </div>
        
        {/* Button */}
        {buttonConfig.variant === "ready" ? (
          <button className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 
                           text-white rounded-lg hover:from-blue-600 hover:to-purple-700 
                           transition-all duration-200 font-medium text-sm">
            {buttonConfig.text}
          </button>
        ) : (
          <button
            className="w-full px-4 py-2 border-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all duration-200 border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={GenerateContent}
            disabled={buttonConfig.disabled}
          >
            {buttonConfig.loading && <Loader className="animate-spin w-4 h-4" />}
            {buttonConfig.text}
          </button>
        )}
      </div>
    </Link>
  );
}

export default MaterialCardItem;
