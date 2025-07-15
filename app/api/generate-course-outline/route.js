import { courseOutlineAIModel } from "/configs/AiModel";
import { db } from "/configs/db";
import { STUDY_MATERIAL_TABLE } from "/configs/schema";
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
      
      // Trigger course content generation in background
      fetch(`${baseUrl}/api/generate-course-content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId: dbResult[0].courseId
        }),
      }).catch(error => {
        console.error("Background course generation failed:", error);
      });

      console.log("Background course generation triggered for courseId:", dbResult[0].courseId);
    } catch (error) {
      console.error("Failed to trigger background generation:", error);
    }

    return NextResponse.json({ result: dbResult[0] });
  } catch (error) {
    console.error("Error processing the request:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
