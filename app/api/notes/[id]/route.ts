import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

interface RouteContext {
  params: Promise<{ id: string }> | { id: string };
}

// ── PUT ROUTE: Update a note ──────────────────────────────────────────────
export async function PUT(request: Request, context: RouteContext) {
  try {
    const resolvedParams = await context.params;
    const id = resolvedParams?.id;

    if (!id || id === "undefined") {
      return NextResponse.json({ error: "Invalid or missing note id" }, { status: 400 });
    }

    const body = await request.json();
    const { title, content, color } = body;

    const { data, error } = await supabase
      .from("Note") // 🧠 Must match your singular database table name
      .update({
        title: title?.trim(),
        content: content?.trim(),
        color: color,
        updatedAt: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ data }, { status: 200 });

  } catch (error: any) {
    console.error("PUT Endpoint Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// ── GET ROUTE: Fetch a single note by ID ──────────────────────────────────
export async function GET(request: Request, context: RouteContext) {
  try {
    const resolvedParams = await context.params;
    const id = resolvedParams?.id;

    if (!id || id === "undefined") {
      return NextResponse.json({ error: "Invalid or missing note id" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("Note") // Matches your singular table name
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ── DELETE ROUTE: Delete a note ───────────────────────────────────────────
export async function DELETE(request: Request, context: RouteContext) {
  try {
    // 1. Safely resolve dynamic parameter tokens
    const resolvedParams = await context.params;
    const id = resolvedParams?.id;

    console.log("Processing DELETE Request for Target ID:", id);

    if (!id || id === "undefined") {
      return NextResponse.json({ error: "Invalid or missing note id" }, { status: 400 });
    }

    // 2. Execute deletion matching the exact row id flag
    const { error } = await supabase
      .from("Note") // 🧠 Must match your singular database table name
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Supabase Database Deletion Error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // 3. Send successful response message back to frontend
    return NextResponse.json({ message: "Note successfully removed" }, { status: 200 });

  } catch (error: any) {
    console.error("DELETE Endpoint Crash Error:", error.message);
    return NextResponse.json(
      { error: error.message || "Internal Server Failure during deletion" },
      { status: 500 }
    );
  }
}