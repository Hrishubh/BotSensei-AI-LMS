"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion } from "framer-motion";
import StudyPageLayout from "../_components/StudyPageLayout";
import NavigationControls from "../_components/NavigationControls";
import ContentCard from "../_components/ContentCard";
import LoadingSpinner from "../../../../components/ui/LoadingSpinner";
import { ArrowLeft } from "lucide-react";

function ViewNotes() {
  const { courseId } = useParams();
  const router = useRouter();
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stepCount, setStepCount] = useState(0);

  const prevStep = () => stepCount > 0 && setStepCount(stepCount - 1);
  const nextStep = () =>
    stepCount < notes.length - 1 && setStepCount(stepCount + 1);

  useEffect(() => {
    if (courseId) {
      fetchNotes();
    }
  }, [courseId]);

  const fetchNotes = async () => {
    try {
      const result = await axios.post("/api/study-type", {
        courseId: courseId,
        studyType: "notes",
      });
      console.log("NOTES", result.data);
      setNotes(result.data);
    } catch (err) {
      console.error("Error fetching notes:", err.message);
      setError("Failed to fetch notes.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <StudyPageLayout
        title="Study Notes"
        description="Comprehensive notes for your learning journey"
      >
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner size="lg" text="Loading notes..." />
        </div>
      </StudyPageLayout>
    );
  }

  if (error) {
    return (
      <StudyPageLayout
        title="Study Notes"
        description="Comprehensive notes for your learning journey"
      >
        <div className="flex flex-col items-center justify-center h-96 text-center">
          <div className="text-red-600 dark:text-red-400 mb-4">
            <p className="text-lg font-medium">{error}</p>
          </div>
          <button
            onClick={() => fetchNotes()}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </StudyPageLayout>
    );
  }

  let jsonObject = null;
  try {
    if (!notes || !notes[stepCount] || !notes[stepCount].notes) {
      throw new Error("Invalid notes data");
    }
    const jsonString = notes[stepCount].notes;
    console.log(jsonString);
    jsonObject = JSON.parse(jsonString);
    console.log("Content", jsonObject);
  } catch (err) {
    console.error("Error parsing JSON:", err.message);
    return (
      <div className="text-center text-red-600 dark:text-red-400 font-medium">
        Error: Failed to parse notes data.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      {/* Back Button - Always Visible */}
      <div className="mb-6">
        <Link href={`/course/${courseId}`} replace>
          <button className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
            <ArrowLeft size={16} />
            Back to Course
          </button>
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div className="text-center text-red-600 dark:text-red-400 p-8">
          <p>{error}</p>
        </div>
      ) : (
        <StudyPageLayout
        title="Study Notes"
        description="Comprehensive notes for your learning journey"
        showNavigation={true}
        navigationProps={{
          currentStep: stepCount,
          totalSteps: notes.length,
          onPrevious: prevStep,
          onNext: nextStep,
          disablePrevious: stepCount === 0 || notes.length === 0,
          disableNext: stepCount === notes.length - 1 || notes.length === 0
        }}
      >
      {/* Render Content */}
      {jsonObject && (
        <motion.div
          key={stepCount}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -20, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Chapter Header */}
          <ContentCard className="mb-6">
            <div className="flex items-center mb-4">
              <span className="text-4xl mr-4">{jsonObject.emoji}</span>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {jsonObject.chapterTitle}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  {jsonObject.chapterSummary}
                </p>
              </div>
            </div>
            
            {/* Chapter Progress */}
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <span>Chapter {stepCount + 1} of {notes.length}</span>
              <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
              <span>{jsonObject.topics?.length || 0} topics</span>
            </div>
          </ContentCard>

          {/* Topics */}
          <div className="space-y-6">
            {jsonObject.topics?.map((topic, index) => (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <ContentCard>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    {topic.topicTitle}
                  </h3>
                  
                  {/* Render Markdown Content */}
                  <div className="prose dark:prose-invert max-w-none 
                                 prose-headings:text-gray-900 dark:prose-headings:text-white
                                 prose-p:text-gray-700 dark:prose-p:text-gray-300
                                 prose-strong:text-gray-900 dark:prose-strong:text-white
                                 prose-code:text-blue-600 dark:prose-code:text-blue-400
                                 prose-code:bg-blue-50 dark:prose-code:bg-blue-900/20
                                 prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800
                                 prose-blockquote:border-blue-500 dark:prose-blockquote:border-blue-400"
                       style={{
                         '--tw-prose-body': '#374151',
                         '--tw-prose-paragraphs': '1rem',
                       }}>
                    <style>{`
                      .prose p { margin-bottom: 1rem !important; line-height: 1.7 !important; }
                      .prose ul { margin-bottom: 1rem !important; margin-top: 0.5rem !important; }
                      .prose li { margin-bottom: 0.25rem !important; }
                      .prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 { margin-top: 1.5rem !important; margin-bottom: 0.75rem !important; }
                    `}</style>
                    <ReactMarkdown
                      children={topic.content}
                      remarkPlugins={[remarkGfm]}
                    />
                  </div>
                </ContentCard>
              </motion.div>
            ))}
          </div>
        </motion.div>
        )}
      </StudyPageLayout>
      )}
    </div>
  );
}

export default ViewNotes;
