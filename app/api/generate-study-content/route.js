import { NextResponse } from "next/server";
import { db } from "/configs/db";
import { STUDY_TYPE_CONTENT_TABLE } from "/configs/schema";
import { 
  GenerateStudyTypeContentAiModel,
  GenerateQuizAiModel,
  GenerateQaAiModel 
} from "/configs/AiModel";
import { eq } from "drizzle-orm";

export async function POST(req) {
  try {
    const { recordId, studyType, prompt, courseId } = await req.json();

    if (!recordId || !studyType || !prompt || !courseId) {
      return NextResponse.json({ 
        error: "Missing required fields: recordId, studyType, prompt, courseId" 
      }, { status: 400 });
    }

    console.log(`Generating ${studyType} content for course: ${courseId}, record: ${recordId}`);

    // Select appropriate AI model based on study type
    let aiModel;
    switch (studyType.toLowerCase()) {
      case 'flashcard':
        aiModel = GenerateStudyTypeContentAiModel;
        break;
      case 'quiz':
        aiModel = GenerateQuizAiModel;
        break;
      case 'question/answer':
      case 'qa':
        aiModel = GenerateQaAiModel;
        break;
      default:
        return NextResponse.json({ 
          error: `Unsupported study type: ${studyType}` 
        }, { status: 400 });
    }

    try {
      // Retry logic for AI generation
      const generateWithRetry = async (model, prompt, retryCount = 0) => {
        try {
          console.log(`Using AI model for ${studyType} generation... (attempt ${retryCount + 1}/3)`);
          const result = await model.sendMessage(prompt);
          const aiResponse = result.response.text();
          
          // Parse AI response
          try {
            const aiResult = JSON.parse(aiResponse);
            console.log(`Successfully generated and parsed ${studyType} content`);
            return aiResult;
          } catch (parseError) {
            console.error("Failed to parse AI response:", parseError);
            if (retryCount < 2) {
              throw new Error("Invalid JSON format, will retry");
            }
            throw new Error("AI returned invalid JSON format after multiple attempts");
          }
        } catch (error) {
          if (retryCount < 2) { // 3 total attempts (0, 1, 2)
            const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
            console.log(`${studyType} generation failed, retrying in ${delay}ms (attempt ${retryCount + 2}/3): ${error.message}`);
            await new Promise(resolve => setTimeout(resolve, delay));
            return generateWithRetry(model, prompt, retryCount + 1);
          }
          throw error; // Final failure after 3 attempts
        }
      };

      // Generate content using AI with retry logic
      const aiResult = await generateWithRetry(aiModel, prompt);
      
      console.log(`AI generation completed for ${studyType}`);

      // Update database with generated content
      await db
        .update(STUDY_TYPE_CONTENT_TABLE)
        .set({
          content: aiResult,
          status: "Ready",
        })
        .where(eq(STUDY_TYPE_CONTENT_TABLE.id, recordId));

      console.log(`${studyType} content generated successfully for record: ${recordId}`);

      return NextResponse.json({ 
        success: true,
        message: `${studyType} content generated successfully`,
        recordId: recordId,
        contentPreview: studyType === 'Flashcard' ? `${aiResult.length || 0} flashcards` :
                       studyType === 'Quiz' ? `${aiResult.questions?.length || 0} questions` :
                       `${aiResult.questions?.length || 0} Q&A pairs`
      });

    } catch (aiError) {
      console.error(`AI generation error for ${studyType}:`, aiError);
      
      // Create error content based on study type
      let errorContent;
      if (studyType.toLowerCase() === 'flashcard') {
        errorContent = [{
          front: "Generation Error",
          back: "Failed to generate flashcard content. Please try again."
        }];
      } else if (studyType.toLowerCase() === 'quiz') {
        errorContent = {
          quizTitle: "Generation Error",
          questions: [{
            question: "Content generation failed",
            options: ["Please try again", "Check your connection", "Contact support", "Refresh the page"],
            answer: "Please try again"
          }]
        };
      } else {
        errorContent = {
          questions: [{
            question: "Why did content generation fail?",
            answer: "There was an error generating the Q&A content. This could be due to network issues, AI service limitations, or content complexity. Please try generating the content again."
          }]
        };
      }
      
      // Update database with error status and fallback content
      await db
        .update(STUDY_TYPE_CONTENT_TABLE)
        .set({
          status: "Error",
          content: errorContent
        })
        .where(eq(STUDY_TYPE_CONTENT_TABLE.id, recordId));

      return NextResponse.json({ 
        error: `Failed to generate ${studyType} content`,
        details: aiError.message,
        recordId: recordId
      }, { status: 500 });
    }

  } catch (error) {
    console.error("Error in study content generation:", error);
    
    // If we have a recordId, try to update the database with error status
    if (req.body && JSON.parse(req.body).recordId) {
      try {
        const { recordId } = JSON.parse(req.body);
        await db
          .update(STUDY_TYPE_CONTENT_TABLE)
          .set({
            status: "Error",
            content: { error: true, message: "Internal server error during generation" }
          })
          .where(eq(STUDY_TYPE_CONTENT_TABLE.id, recordId));
      } catch (dbError) {
        console.error("Failed to update error status in database:", dbError);
      }
    }
    
    return NextResponse.json({ 
      error: "Internal server error",
      details: error.message 
    }, { status: 500 });
  }
}