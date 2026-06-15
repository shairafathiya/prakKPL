import { NextRequest, NextResponse } from "next/server";
import { getNoteById, updateNote, deleteNote } from "@/lib/db";

type Params = { params: Promise<{ id: string }> };

// GET /api/notes/:id — Fetch a single note
export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const note = getNoteById(id);
  if (!note) {
    return NextResponse.json(
      { success: false, error: `Note with id "${id}" not found` },
      { status: 404 }
    );
  }
  return NextResponse.json({ success: true, data: note }, { status: 200 });
}

// PUT /api/notes/:id — Update a note
export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    const body = await request.json();
    const { title, content, color } = body;

    const existing = getNoteById(id);
    if (!existing) {
      return NextResponse.json(
        { success: false, error: `Note with id "${id}" not found` },
        { status: 404 }
      );
    }

    const updated = updateNote(id, {
      ...(title !== undefined && { title: String(title).trim() }),
      ...(content !== undefined && { content: String(content).trim() }),
      ...(color !== undefined && { color }),
    });

    return NextResponse.json({ success: true, data: updated }, { status: 200 });
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON body" },
      { status: 400 }
    );
  }
}

// DELETE /api/notes/:id — Delete a note
export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const deleted = deleteNote(id);
  if (!deleted) {
    return NextResponse.json(
      { success: false, error: `Note with id "${id}" not found` },
      { status: 404 }
    );
  }
  return NextResponse.json(
    { success: true, message: `Note "${id}" deleted successfully` },
    { status: 200 }
  );
}
