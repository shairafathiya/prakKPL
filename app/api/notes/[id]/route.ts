import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface RouteParams {
  params: { id: string };
}

// 1. PUT /api/notes/:id - Update an existing note
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const noteId = Number(params.id);
    if (Number.isNaN(noteId)) {
      return NextResponse.json({ error: "Invalid note id" }, { status: 400 });
    }

    const body = await request.json();
    const { title, content, color } = body;

    const updatedNote = await prisma.note.update({
      where: { id: noteId },
      data: { title, content, color },
    });

    return NextResponse.json({ data: updatedNote });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update note" }, { status: 500 });
  }
}

// 2. DELETE /api/notes/:id - Permanently delete a note
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const noteId = Number(params.id);
    if (Number.isNaN(noteId)) {
      return NextResponse.json({ error: "Invalid note id" }, { status: 400 });
    }

    await prisma.note.delete({
      where: { id: noteId },
    });

    return NextResponse.json({ message: "Note deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete note" }, { status: 500 });
  }
}