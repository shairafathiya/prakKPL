"use client"; 

import { Note } from "@/types/note";

interface NoteCardProps {
  item: Note;
  onEdit: (note: Note) => void;
  onDelete: (note: Note) => void;
}

export default function NoteCard({ item, onEdit, onDelete }: NoteCardProps) {
  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="note-card" style={{ background: item.color, padding: 20, display: "flex", flexDirection: "column" }}>
      <h3 style={{ margin: "0 0 10px", fontSize: 17, fontWeight: 700, color: "var(--ink)", lineHeight: 1.3 }}>
        {item.title}
      </h3>
      <p style={{ margin: "0 0 16px", color: "var(--ink-light)", fontSize: 14, lineHeight: 1.7, flex: 1, display: "-webkit-box", WebkitLineClamp: 5, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
        {item.content}
      </p>
      <div style={{ borderTop: "1px solid rgba(0,0,0,0.08)", paddingTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 11, color: "var(--ink-light)", fontFamily: "sans-serif" }}>
          {formatDate(item.updatedAt)}
        </span>
        <div style={{ display: "flex", gap: 6 }}>
          <button className="btn btn-ghost" style={{ padding: "5px 10px", fontSize: 12 }} onClick={() => onEdit(item)}>
            ✏️ Edit
          </button>
          <button className="btn btn-danger" style={{ padding: "5px 10px", fontSize: 12 }} onClick={() => onDelete(item)}>
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}