import { db } from "/configs/db";
import { STUDY_TYPE_CONTENT_TABLE, CHAPTER_NOTES_TABLE } from "/configs/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");

    if (!courseId) {
      return NextResponse.json({ error: "courseId required" }, { status: 400 });
    }

    // Get all study materials for this course in parallel - OPTIMIZED!
    const [materials, chapterNotes] = await Promise.all([
      db.select().from(STUDY_TYPE_CONTENT_TABLE).where(eq(STUDY_TYPE_CONTENT_TABLE.courseId, courseId)),
      db.select().from(CHAPTER_NOTES_TABLE).where(eq(CHAPTER_NOTES_TABLE.courseId, courseId))
    ]);

    // Initialize status map with default values
    const statusMap = {
      notes: chapterNotes && chapterNotes.length > 0 ? 'Ready' : 'Ready', // Notes are auto-generated
      flashcard: 'Not Generated', 
      quiz: 'Not Generated',
      qa: 'Not Generated'
    };

    // Map all materials in a single optimized pass
    materials.forEach(material => {
      const type = material.type.toLowerCase();
      
      switch(type) {
        case 'flashcard':
          statusMap.flashcard = material.status;
          break;
        case 'quiz':
          statusMap.quiz = material.status;
          break;
        case 'question/answer':
          statusMap.qa = material.status;
          break;
        default:
          console.warn(`Unknown material type: ${material.type}`);
      }
    });

    return NextResponse.json(statusMap);
  } catch (error) {
    console.error("Error fetching generation status:", error);
    return NextResponse.json({ error: "Failed to fetch status" }, { status: 500 });
  }
}