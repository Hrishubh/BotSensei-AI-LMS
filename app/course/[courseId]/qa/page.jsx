"use client";

import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import StudyPageLayout from "../_components/StudyPageLayout";
import NavigationControls from "../_components/NavigationControls";
import ContentCard from "../_components/ContentCard";
import LoadingSpinner from "../../../../components/ui/LoadingSpinner";
import { Eye, EyeOff, MessageSquare } from "lucide-react";

function ViewQA() {
  const router = useRouter();
  const [qaData, setQaData] = useState([]);
  const [stepCount, setStepCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAnswer, setShowAnswer] = useState(true); // Tracks whether the answer is shown
  const { courseId } = useParams();

  useEffect(() => {
    GetQA();
  }, [courseId]);

  const GetQA = async () => {
    try {
      const result = await axios.post("/api/study-type", {
        courseId: courseId,
        studyType: "Question/Answer",
      });
      console.log("QA DATA", result.data);
      setQaData(result.data.content.questions);
    } catch (err) {
      console.error("Error fetching QA data:", err.message);
      setError("Failed to fetch QA data.");
    } finally {
      setLoading(false);
    }
  };

  const prevStep = () => {
    setStepCount((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const nextStep = () => {
    setStepCount((prev) => (prev < qaData.length - 1 ? prev + 1 : prev));
  };

  const toggleAnswer = () => {
    setShowAnswer((prev) => !prev);
  };

  if (loading) {
    return (
      <StudyPageLayout
        title="Questions & Answers"
        description="Detailed Q&A to deepen your understanding"
      >
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner size="lg" text="Loading questions..." />
        </div>
      </StudyPageLayout>
    );
  }

  if (error) {
    return (
      <StudyPageLayout
        title="Questions & Answers"
        description="Detailed Q&A to deepen your understanding"
      >
        <div className="flex flex-col items-center justify-center h-96 text-center">
          <div className="text-red-600 dark:text-red-400 mb-4">
            <p className="text-lg font-medium">{error}</p>
          </div>
          <button
            onClick={() => GetQA()}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </StudyPageLayout>
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

      <StudyPageLayout
        title="Questions & Answers"
        description="Detailed Q&A to deepen your understanding"
      showNavigation={true}
      navigationProps={{
        currentStep: stepCount,
        totalSteps: qaData.length,
        onPrevious: prevStep,
        onNext: nextStep,
        disablePrevious: stepCount === 0 || qaData.length === 0,
        disableNext: stepCount === qaData.length - 1 || qaData.length === 0
      }}
    >
      {/* Render QA Content */}
      {qaData[stepCount] && (
        <motion.div
          key={stepCount}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -20, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Question Card */}
          <ContentCard className="mb-6 max-w-5xl mx-auto">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <MessageSquare className="text-blue-600 dark:text-blue-400" size={24} />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 leading-relaxed">
                  {qaData[stepCount].question}
                </h2>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={toggleAnswer}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 
                             text-white rounded-lg transition-all duration-200 font-medium"
                >
                  {showAnswer ? (
                    <>
                      <EyeOff size={18} />
                      Hide Answer
                    </>
                  ) : (
                    <>
                      <Eye size={18} />
                      Show Answer
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </ContentCard>

          {/* Answer Card */}
          <AnimatePresence>
            {showAnswer && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                style={{ overflow: "hidden" }}
              >
                <ContentCard>
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <Eye className="text-green-600 dark:text-green-400" size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Answer
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
                          children={qaData[stepCount].answer}
                          remarkPlugins={[remarkGfm]}
                        />
                      </div>
                    </div>
                  </div>
                </ContentCard>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Progress Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center mt-6"
          >
            <p className="text-gray-600 dark:text-gray-300">
              Question {stepCount + 1} of {qaData.length}
            </p>
          </motion.div>
        </motion.div>
      )}
    </StudyPageLayout>
    </div>
  );
}

export default ViewQA;
