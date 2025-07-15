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

        // Create user directly in database
        const newUser = await db
            .insert(USER_TABLE)
            .values({
                name: user.fullName,
                email: user.email,
                isMember: false
            })
            .returning();
        
        return NextResponse.json({ 
            success: true, 
            message: "User created successfully",
            user: newUser[0]
        });
    } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json(
            { success: false, error: error.message }, 
            { status: 500 }
        );
    }
}
