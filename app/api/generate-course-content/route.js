import { NextResponse } from "next/server";
import { db } from "/configs/db";
import { STUDY_MATERIAL_TABLE, CHAPTER_NOTES_TABLE } from "/configs/schema";
import { generateNotesAiModel } from "/configs/AiModel";
import { eq } from "drizzle-orm";

export async function POST(req) {
  try {
    const { courseId } = await req.json();

    if (!courseId) {
      return NextResponse.json({ error: "courseId required" }, { status: 400 });
    }

    console.log(`Starting content generation for course: ${courseId}`);

    // Get course data
    const course = await db
      .select()
      .from(STUDY_MATERIAL_TABLE)
      .where(eq(STUDY_MATERIAL_TABLE.courseId, courseId))
      .then(results => results[0]);

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const chapters = course.courseLayout.chapters;
    let successCount = 0;
    let errorCount = 0;

    // Process chapters sequentially to avoid overwhelming the AI API
    for (let index = 0; index < chapters.length; index++) {
      const chapter = chapters[index];
      
      try {
        console.log(`Generating content for chapter ${index + 1}/${chapters.length}: ${chapter.chapterTitle}`);

        const PROMPT = `Generate a JSON object that represents study notes for a course chapter. The JSON should meet the following requirements:
0. Provided Chapters:
${JSON.stringify(chapter)}

1. Structure:
The JSON must include the following fields:
chapterTitle: The title of the chapter.
chapterSummary: A brief summary of the chapter.
emoji: A relevant emoji to visually represent the chapter.
topics: A list of topics covered in the chapter. Each topic must be an object with:
topicTitle (string): The title of the topic.
content (string): Detailed content for the topic written in Md format, and ready for rendering in a React.js component.

OUTPUT SHOULD BE LIKE : 
{
  "chapterTitle": "WordPress Fundamentals",
  "chapterSummary": "Introduction to WordPress, its architecture, core components, and installation process.",
  "emoji": "🌱",
  "topics": [
    {
      "topicTitle": "What is WordPress?",
      "content": "# What is WordPress? 🤔\\n\\nWordPress is a free and open-source content management system (CMS) used to build and manage websites and blogs. Its popularity stems from its user-friendly interface, extensive plugin ecosystem, and robust theme customization options. \\n\\n**Key Features:**\\n\\n* **Ease of Use:**  Intuitive interface, making it accessible to beginners and experts alike.\\n* **Flexibility:**  Highly adaptable to various website needs through themes and plugins.\\n* **Extensive Community:** Large community support with thousands of themes and plugins available."
    }
  ]
}

2. Content Formatting:
Give me in .md format

**IMPORTANT**
- There should be an emoji
- Every Content should be in detail and explained properly
- Each 'content' field should use simple and concise language suitable for study notes.
- Ensure that topics include clear definitions, key points, and, where appropriate, examples or sample code.
- All generated content should be focused on clarity and exam preparation, with minimal redundancy.
- Double-check for mismatched brackets, missing fields, or improperly formatted strings.`;

        // Retry logic for AI generation
        const generateWithRetry = async (prompt, retryCount = 0) => {
          try {
            const result = await generateNotesAiModel.sendMessage(prompt);
            return await result.response.text();
          } catch (error) {
            if (retryCount < 2) { // 3 total attempts (0, 1, 2)
              const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
              console.log(`Chapter ${index + 1} failed, retrying in ${delay}ms (attempt ${retryCount + 2}/3)`);
              await new Promise(resolve => setTimeout(resolve, delay));
              return generateWithRetry(prompt, retryCount + 1);
            }
            throw error; // Final failure after 3 attempts
          }
        };

        const aiResp = await generateWithRetry(PROMPT);

        // Insert notes into database
        await db.insert(CHAPTER_NOTES_TABLE).values({
          chapterId: index,
          courseId: courseId,
          notes: aiResp,
        });

        successCount++;
        console.log(`Chapter ${index + 1} completed successfully`);

        // Small delay to avoid rate limiting
        if (index < chapters.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

      } catch (error) {
        console.error(`Error generating chapter ${index + 1}:`, error);
        errorCount++;
        
        // Insert error placeholder to maintain chapter order
        await db.insert(CHAPTER_NOTES_TABLE).values({
          chapterId: index,
          courseId: courseId,
          notes: JSON.stringify({
            error: true,
            message: "Failed to generate content for this chapter",
            chapterTitle: chapter.chapterTitle,
            emoji: "❌",
            chapterSummary: "Content generation failed",
            topics: [{
              topicTitle: "Generation Error",
              content: "# Generation Error ❌\\n\\nThis chapter could not be generated due to an error. Please try regenerating the course content."
            }]
          }),
        });
      }
    }

    // Update course status
    const finalStatus = errorCount === 0 ? "Ready" : "Partial";
    await db
      .update(STUDY_MATERIAL_TABLE)
      .set({ status: finalStatus })
      .where(eq(STUDY_MATERIAL_TABLE.courseId, courseId));

    console.log(`Course generation completed. Success: ${successCount}, Errors: ${errorCount}`);

    return NextResponse.json({ 
      success: true,
      message: `Course content generated. ${successCount} chapters successful, ${errorCount} errors.`,
      stats: { successCount, errorCount, total: chapters.length }
    });

  } catch (error) {
    console.error("Error in course content generation:", error);
    
    // Update course status to error
    try {
      await db
        .update(STUDY_MATERIAL_TABLE)
        .set({ status: "Error" })
        .where(eq(STUDY_MATERIAL_TABLE.courseId, courseId));
    } catch (dbError) {
      console.error("Failed to update course status:", dbError);
    }

    return NextResponse.json({ 
      error: "Failed to generate course content",
      details: error.message 
    }, { status: 500 });
  }
}