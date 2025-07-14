import { db } from "/configs/db";
import { USER_TABLE } from "/configs/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const existingUser = await db
      .select()
      .from(USER_TABLE)
      .where(eq(USER_TABLE.email, email));

    return NextResponse.json({ 
      exists: existingUser.length > 0,
      user: existingUser.length > 0 ? existingUser[0] : null
    });
  } catch (error) {
    console.error("Error checking user existence:", error);
    return NextResponse.json({ error: "Failed to check user" }, { status: 500 });
  }
}