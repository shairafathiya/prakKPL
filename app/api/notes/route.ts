import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Adjust this path if your instance file is named differently

// 1. GET /api/notes - Fetch all notes
export async function GET() {
  try {
    const notes = await prisma.note.findMany({
      orderBy: { updatedAt: "desc" }, // Fresh notes first
    });
    return NextResponse.json({ data: notes });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch notes" }, { status: 500 });
  }
}

// 2. POST /api/notes - Create a note
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, content, color } = body;

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
    }

    const newNote = await prisma.note.create({
      data: {
        title,
        content,
        color: color || "#FFFFFF",
      },
    });

    return NextResponse.json({ data: newNote }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create note" }, { status: 500 });
  }
}