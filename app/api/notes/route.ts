import { NextRequest, NextResponse } from "next/server";
import { getAllNotes, createNote } from "@/lib/db";

// GET /api/notes — Fetch all notes
export async function GET() {
  const notes = getAllNotes();
  return NextResponse.json(
    {
      success: true,
      count: notes.length,
      data: notes,
    },
    { status: 200 }
  );
}

// POST /api/notes — Create a new note
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, color } = body;

    if (!title || typeof title !== "string" || title.trim() === "") {
      return NextResponse.json(
        { success: false, error: "Title is required" },
        { status: 400 }
      );
    }
    if (!content || typeof content !== "string" || content.trim() === "") {
      return NextResponse.json(
        { success: false, error: "Content is required" },
        { status: 400 }
      );
    }

    const note = createNote({
      title: title.trim(),
      content: content.trim(),
      color: color || "#FFFFFF",
    });

    return NextResponse.json({ success: true, data: note }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON body" },
      { status: 400 }
    );
  }


  
}
