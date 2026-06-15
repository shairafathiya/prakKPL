import { Note } from "@/types/note";
import { v4 as uuidv4 } from "uuid";

// In-memory store (resets on server restart)
let notes: Note[] = [
  {
    id: uuidv4(),
    title: "Welcome to Notebook!",
    content:
      "This is your first note. You can create, edit, and delete notes using the UI or the REST API.",
    color: "#FFF9C4",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    title: "API Endpoints",
    content:
      "GET /api/notes — list all\nGET /api/notes/:id — get one\nPOST /api/notes — create\nPUT /api/notes/:id — update\nDELETE /api/notes/:id — delete",
    color: "#C8E6C9",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export function getAllNotes(): Note[] {
  return notes;
}

export function getNoteById(id: string): Note | undefined {
  return notes.find((n) => n.id === id);
}

export function createNote(data: {
  title: string;
  content: string;
  color?: string;
}): Note {
  const note: Note = {
    id: uuidv4(),
    title: data.title,
    content: data.content,
    color: data.color || "#FFFFFF",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  notes.push(note);
  return note;
}

export function updateNote(
  id: string,
  data: { title?: string; content?: string; color?: string }
): Note | null {
  const index = notes.findIndex((n) => n.id === id);
  if (index === -1) return null;
  notes[index] = {
    ...notes[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  return notes[index];
}

export function deleteNote(id: string): boolean {
  const index = notes.findIndex((n) => n.id === id);
  if (index === -1) return false;
  notes.splice(index, 1);
  return true;
}
