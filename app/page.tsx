"use client";

import { useState, useEffect, useCallback } from "react";
import { Note, CreateNoteDto, UpdateNoteDto } from "@/types/note";




const NOTE_COLORS = [
  "#FFFFFF", "#FFF9C4", "#C8E6C9", "#BBDEFB",
  "#F8BBD0", "#E1BEE7", "#FFE0B2", "#D7CCC8",
];

const API_DOCS = [
  { method: "GET",    path: "/api/notes",      desc: "List all notes",   body: null },
  { method: "GET",    path: "/api/notes/:id",  desc: "Get a note by ID", body: null },
  { method: "POST",   path: "/api/notes",      desc: "Create a note",    body: '{\n  "title": "My Note",\n  "content": "Hello world",\n  "color": "#FFF9C4"\n}' },
  { method: "PUT",    path: "/api/notes/:id",  desc: "Update a note",    body: '{\n  "title": "Updated Title",\n  "content": "New content"\n}' },
  { method: "DELETE", path: "/api/notes/:id",  desc: "Delete a note",    body: null },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

// ── Modal ──────────────────────────────────────────────────────────────────
function NoteModal({
  note,
  onClose,
  onSave,
}: {
  note: Note | null;
  onClose: () => void;
  onSave: (data: CreateNoteDto | UpdateNoteDto) => Promise<void>;
}) {
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [color, setColor] = useState(note?.color || "#FFFFFF");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!title.trim()) { setError("Title is required"); return; }
    if (!content.trim()) { setError("Content is required"); return; }
    setSaving(true);
    setError("");
    try {
      await onSave({ title: title.trim(), content: content.trim(), color });
      onClose();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div style={{ padding: "24px 24px 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "var(--ink)" }}>
              {note ? "Edit Note" : "New Note"}
            </h2>
            <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "var(--ink-light)", lineHeight: 1 }}>×</button>
          </div>

          {error && (
            <div style={{ background: "#fff5f5", border: "1px solid #feb2b2", borderRadius: 8, padding: "10px 14px", marginBottom: 16, color: "var(--danger)", fontSize: 14 }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "var(--ink-light)", fontFamily: "sans-serif" }}>TITLE</label>
            <input className="input" placeholder="Note title…" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "var(--ink-light)", fontFamily: "sans-serif" }}>CONTENT</label>
            <textarea className="input" placeholder="Write your note…" value={content} onChange={(e) => setContent(e.target.value)} />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 10, color: "var(--ink-light)", fontFamily: "sans-serif" }}>NOTE COLOR</label>
            <div style={{ display: "flex", gap: 10 }}>
              {NOTE_COLORS.map((c) => (
                <button key={c} className={`color-swatch${color === c ? " selected" : ""}`} style={{ background: c, borderColor: color === c ? "var(--accent)" : "var(--border)" }} onClick={() => setColor(c)} title={c} />
              ))}
            </div>
          </div>
        </div>

        <div style={{ padding: "16px 24px 24px", borderTop: "1px solid var(--border)", display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : note ? "Save Changes" : "Create Note"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Delete Confirm ─────────────────────────────────────────────────────────
function DeleteModal({ note, onClose, onConfirm }: { note: Note; onClose: () => void; onConfirm: () => Promise<void> }) {
  const [deleting, setDeleting] = useState(false);
  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 400 }}>
        <div style={{ padding: 24 }}>
          <div style={{ fontSize: 40, textAlign: "center", marginBottom: 12 }}>🗑️</div>
          <h2 style={{ margin: "0 0 8px", textAlign: "center", fontSize: 18 }}>Delete Note?</h2>
          <p style={{ textAlign: "center", color: "var(--ink-light)", margin: "0 0 24px", fontSize: 14, fontFamily: "sans-serif" }}>
            "<strong>{note.title}</strong>" will be permanently deleted.
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn btn-ghost" style={{ flex: 1, justifyContent: "center" }} onClick={onClose}>Cancel</button>
            <button className="btn btn-danger" style={{ flex: 1, justifyContent: "center", background: "var(--danger)", color: "white" }}
              onClick={async () => { setDeleting(true); await onConfirm(); }}
              disabled={deleting}>
              {deleting ? "Deleting…" : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── API Docs Panel ─────────────────────────────────────────────────────────
function ApiPanel({ onClose }: { onClose: () => void }) {
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 640, maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ padding: "24px 24px 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>📡 API Reference</h2>
            <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "var(--ink-light)", lineHeight: 1 }}>×</button>
          </div>
          <p style={{ color: "var(--ink-light)", fontSize: 13, margin: "0 0 20px", fontFamily: "sans-serif" }}>
            Use these endpoints with Postman, curl, or any HTTP client.
          </p>
        </div>

        <div style={{ padding: "0 24px 24px" }}>
          <div style={{ background: "var(--paper-dark)", borderRadius: 8, padding: "10px 14px", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontFamily: "monospace", fontSize: 13, color: "var(--ink-light)" }}>Base URL: <strong style={{ color: "var(--ink)" }}>{baseUrl}</strong></span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {API_DOCS.map((ep, i) => {
              const m = ep.method.toLowerCase() as "get" | "post" | "put" | "delete";
              const fullUrl = `${baseUrl}${ep.path}`;
              return (
                <div key={i} style={{ border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
                  <div style={{ padding: "12px 16px", background: "white", display: "flex", alignItems: "center", gap: 10 }}>
                    <span className={`api-badge method-${m}`}>{ep.method}</span>
                    <code style={{ fontSize: 13, color: "var(--ink)", flex: 1 }}>{ep.path}</code>
                    <span style={{ fontSize: 12, color: "var(--ink-light)", fontFamily: "sans-serif" }}>{ep.desc}</span>
                  </div>
                  <div style={{ padding: "10px 16px", background: "var(--paper)", display: "flex", alignItems: "center", gap: 8 }}>
                    <code style={{ fontSize: 11, color: "var(--ink-light)", flex: 1, wordBreak: "break-all" }}>{fullUrl}</code>
                    <button className="btn btn-ghost" style={{ padding: "4px 10px", fontSize: 11 }} onClick={() => copy(fullUrl, `url-${i}`)}>
                      {copied === `url-${i}` ? "✓ Copied" : "Copy URL"}
                    </button>
                  </div>
                  {ep.body && (
                    <div style={{ padding: "10px 16px", background: "#1a1a2e", position: "relative" }}>
                      <div style={{ position: "absolute", top: 8, right: 12 }}>
                        <button style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "white", borderRadius: 4, padding: "3px 8px", fontSize: 11, cursor: "pointer" }}
                          onClick={() => copy(ep.body!, `body-${i}`)}>
                          {copied === `body-${i}` ? "✓ Copied" : "Copy"}
                        </button>
                      </div>
                      <pre style={{ margin: 0, color: "#c8e6c9", fontSize: 12, fontFamily: "monospace" }}>{ep.body}</pre>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 20, padding: "14px 16px", background: "#f0fff4", border: "1px solid #c6f6d5", borderRadius: 8 }}>
            <p style={{ margin: 0, fontSize: 13, color: "#276749", fontFamily: "sans-serif" }}>
              <strong>💡 Postman Tip:</strong> Set <code>Content-Type: application/json</code> in headers for POST and PUT requests.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function HomePage() {


  
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [editNote, setEditNote] = useState<Note | null | "new">(null);
  const [deleteNote, setDeleteNote] = useState<Note | null>(null);
  const [showApi, setShowApi] = useState(false);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/notes");
      const data = await res.json();
      setNotes(data.data || []);
    } catch {
      showToast("Failed to load notes", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchNotes(); }, [fetchNotes]);

  const handleCreate = async (dto: CreateNoteDto | UpdateNoteDto) => {
    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to create note");
    }
    await fetchNotes();
    showToast("Note created!");
  };

  const handleUpdate = (note: Note) => async (dto: CreateNoteDto | UpdateNoteDto) => {
    const res = await fetch(`/api/notes/${note.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to update note");
    }
    await fetchNotes();
    showToast("Note updated!");
  };

  const handleDelete = async () => {
    if (!deleteNote) return;
    const res = await fetch(`/api/notes/${deleteNote.id}`, { method: "DELETE" });
    if (!res.ok) { showToast("Failed to delete", "error"); return; }
    await fetchNotes();
    setDeleteNote(null);
    showToast("Note deleted!");
  };

  const filtered = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", top: 24, right: 24, zIndex: 100,
          background: toast.type === "success" ? "#38a169" : "#e53e3e",
          color: "white", padding: "12px 20px", borderRadius: 10,
          fontFamily: "sans-serif", fontSize: 14, fontWeight: 500,
          boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
          animation: "slideUp 0.2s ease",
        }}>
          {toast.type === "success" ? "✓" : "✕"} {toast.msg}
        </div>
      )}

      {/* Header */}
      <header style={{ background: "white", borderBottom: "1px solid var(--border)", position: "sticky", top: 0, zIndex: 40 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", gap: 16, height: 64 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 28 }}>📓</span>
            <span style={{ fontSize: 20, fontWeight: 700, color: "var(--ink)" }}>Notebook</span>
            <span className="tag">REST API</span>
          </div>
          <div style={{ flex: 1 }}>
            <input className="input" placeholder="🔍  Search notes…" value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ maxWidth: 320, padding: "7px 14px", fontSize: 14 }} />
          </div>
          <button className="btn btn-ghost" onClick={() => setShowApi(true)}>📡 API Docs</button>
          <button className="btn btn-primary" onClick={() => setEditNote("new")}>+ New Note</button>
        </div>
      </header>

      {/* Body */}
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>
        {/* Stats bar */}
        <div style={{ display: "flex", gap: 12, marginBottom: 28, flexWrap: "wrap" }}>
          {[
            { label: "Total Notes", value: notes.length, color: "#6c63ff" },
            { label: "Showing", value: filtered.length, color: "#38a169" },
          ].map((s) => (
            <div key={s.label} style={{ background: "white", border: "1px solid var(--border)", borderRadius: 10, padding: "12px 20px", display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 24, fontWeight: 800, color: s.color, fontFamily: "sans-serif" }}>{s.value}</span>
              <span style={{ fontSize: 13, color: "var(--ink-light)", fontFamily: "sans-serif" }}>{s.label}</span>
            </div>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: 80, color: "var(--ink-light)", fontFamily: "sans-serif" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>⏳</div>
            Loading notes…
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: 80, color: "var(--ink-light)", fontFamily: "sans-serif" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
            <p style={{ fontSize: 18, marginBottom: 8 }}>{search ? "No notes match your search" : "No notes yet"}</p>
            {!search && <button className="btn btn-primary" onClick={() => setEditNote("new")}>Create your first note</button>}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
            {filtered.map((note) => (
              <div key={note.id} className="note-card" style={{ background: note.color, padding: 20, display: "flex", flexDirection: "column" }}>
                <h3 style={{ margin: "0 0 10px", fontSize: 17, fontWeight: 700, color: "var(--ink)", lineHeight: 1.3 }}>{note.title}</h3>
                <p style={{ margin: "0 0 16px", color: "var(--ink-light)", fontSize: 14, lineHeight: 1.7, flex: 1, display: "-webkit-box", WebkitLineClamp: 5, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {note.content}
                </p>
                <div style={{ borderTop: "1px solid rgba(0,0,0,0.08)", paddingTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 11, color: "var(--ink-light)", fontFamily: "sans-serif" }}>
                    {formatDate(note.updatedAt)}
                  </span>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button className="btn btn-ghost" style={{ padding: "5px 10px", fontSize: 12 }} onClick={() => setEditNote(note)}>
                      ✏️ Edit
                    </button>
                    <button className="btn btn-danger" style={{ padding: "5px 10px", fontSize: 12 }} onClick={() => setDeleteNote(note)}>
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      {editNote === "new" && (
        <NoteModal note={null} onClose={() => setEditNote(null)} onSave={handleCreate} />
      )}
      {editNote && editNote !== "new" && (
        <NoteModal note={editNote} onClose={() => setEditNote(null)} onSave={handleUpdate(editNote)} />
      )}
      {deleteNote && (
        <DeleteModal note={deleteNote} onClose={() => setDeleteNote(null)} onConfirm={handleDelete} />
      )}
      {showApi && <ApiPanel onClose={() => setShowApi(false)} />}
    </>
  );
}
