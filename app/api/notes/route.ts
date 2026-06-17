import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient"; 

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("Note")
      .select("*")
      .order("updatedAt", { ascending: false });

    if (error) throw error;
    return NextResponse.json({ data: data || [] }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, content, color } = body;

    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
    }

    // 🔍 Force clean payload mapping
    const payload = {
      title: title.trim(),
      content: content.trim(),
      color: color || "#FFFFFF",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("Note")
      .insert([payload])
      .select()
      .single();

    // If Supabase rejects the insert, this sends the exact Postgres error message to the frontend
    if (error) {
      console.error("Supabase Database Error:", error);
      return NextResponse.json({ error: `Supabase Error: ${error.message} (${error.details || 'No details'})` }, { status: 400 });
    }

    return NextResponse.json({ data }, { status: 201 });

  } catch (error: any) {
    console.error("Server Crash Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Crash" },
      { status: 500 }
    );
  }
}