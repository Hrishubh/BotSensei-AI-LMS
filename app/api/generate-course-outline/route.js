import { courseOutlineAIModel } from "/configs/AiModel";
import { db } from "/configs/db";
import { STUDY_MATERIAL_TABLE } from "/configs/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { courseId, topic, courseType, difficultyLevel, createdBy } =
      await req.json();

    console.log("Received data:", {
      courseId,
      topic,
      courseType,
      difficultyLevel,
      createdBy,
    });

    const PROMPT = `Generate a study material with course title for ${topic} for ${courseType} and level of difficulty will be ${difficultyLevel} with summary of course, List of Chapters along with summary and Emoji icon for each chapter, Topic list in each chapter in JSON format`;

    const aiResp = await courseOutlineAIModel.sendMessage(PROMPT);
    console.log("AI response:", aiResp);

    const aiResult = JSON.parse(aiResp.response.text());
    console.log("Parsed AI result:", aiResult);

    const dbResult = await db
      .insert(STUDY_MATERIAL_TABLE)
      .values({
        courseId,
        courseType,
        createdBy,
        topic,
        courseLayout: aiResult,
        status: "Generating" // Set initial status
      })
      .returning();

    console.log("Database insertion result:", dbResult);

    // CHANGED: Call direct API instead of Inngest
    try {
      // Get the base URL for the API call
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                     (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
      
      console.log("Attempting to trigger background generation with baseUrl:", baseUrl);
      
      // Retry logic for background API calls
      const triggerWithRetry = async (url, payload, retryCount = 0) => {
        try {
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          });
          
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          
          console.log("Background course generation started successfully");
          return await response.json();
        } catch (error) {
          if (retryCount < 2) { // 3 total attempts
            const delay = Math.pow(2, retryCount) * 2000; // 2s, 4s, 8s
            console.log(`Background API call failed, retrying in ${delay}ms (attempt ${retryCount + 2}/3): ${error.message}`);
            await new Promise(resolve => setTimeout(resolve, delay));
            return triggerWithRetry(url, payload, retryCount + 1);
          }
          throw error; // Final failure
        }
      };
      
      // Trigger course content generation with retry
      triggerWithRetry(`${baseUrl}/api/generate-course-content`, {
        courseId: dbResult[0].courseId
      }).catch(async (error) => {
        console.error("Background course generation failed after all retries:", error);
        
        // CRITICAL: Update status to Error if all retries fail
        try {
          await db
            .update(STUDY_MATERIAL_TABLE)
            .set({ status: "Error" })
            .where(eq(STUDY_MATERIAL_TABLE.courseId, dbResult[0].courseId));
          console.log("Updated course status to Error due to background call failure");
        } catch (dbError) {
          console.error("Failed to update course status after background failure:", dbError);
        }
      });

      console.log("Background course generation triggered for courseId:", dbResult[0].courseId);
    } catch (error) {
      console.error("Failed to trigger background generation:", error);
      
      // CRITICAL: Update status to Error if we can't even make the call
      try {
        await db
          .update(STUDY_MATERIAL_TABLE)
          .set({ status: "Error" })
          .where(eq(STUDY_MATERIAL_TABLE.courseId, dbResult[0].courseId));
      } catch (dbError) {
        console.error("Failed to update course status:", dbError);
      }
    }

    return NextResponse.json({ result: dbResult[0] });
  } catch (error) {
    console.error("Error processing the request:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
