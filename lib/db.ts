import { supabase } from "./supabase";

export async function getNotes() {
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) throw error;

  return data;
}

export async function getNoteById(id: string) {
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;

  return data;
}

export async function createNote(note: {
  title: string;
  content: string;
  color: string;
}) {
  const { data, error } = await supabase
    .from("notes")
    .insert(note)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function updateNote(
  id: string,
  note: {
    title?: string;
    content?: string;
    color?: string;
  }
) {
  const { data, error } = await supabase
    .from("notes")
    .update(note)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function deleteNote(id: string) {
  const { error } = await supabase
    .from("notes")
    .delete()
    .eq("id", id);

  if (error) throw error;

  return true;
}