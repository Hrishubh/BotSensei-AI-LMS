import { inngest } from "../../../inngest/client";
import { db } from "/configs/db";
import { USER_TABLE } from "/configs/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req){
    const {user} = await req.json();
    
    try {
        // Check if user already exists
        const existingUser = await db
            .select()
            .from(USER_TABLE)
            .where(eq(USER_TABLE.email, user.email));

        if (existingUser.length > 0) {
            return NextResponse.json({ 
                success: true, 
                message: "User already exists",
                user: existingUser[0]
            });
        }

        // Only call Inngest if user doesn't exist
        const result = await inngest.send({
            name: 'user.create',
            data: {
                user: {
                    fullName: user.fullName,
                    primaryEmailAddress: { 
                        emailAddress: user.email 
                    }
                }
            }
        });
        
        return NextResponse.json({ success: true, result });
    } catch (error) {
        console.error("Error sending Inngest event:", error);
        return NextResponse.json(
            { success: false, error: error.message }, 
            { status: 500 }
        );
    }
}
