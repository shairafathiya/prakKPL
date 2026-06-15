# 📓 Notebook — Next.js CRUD App with REST API

A full-stack notebook app built with Next.js 15 App Router. Create, read, update, and delete notes through both the web UI and a REST API (Postman-friendly).

---

## 🚀 Getting Started

```bash
npm install
npm run dev
# Open http://localhost:3000
```

---

## 📡 API Endpoints

Base URL: `http://localhost:3000`

### GET /api/notes
**List all notes**
```
GET http://localhost:3000/api/notes
```
Response:
```json
{ "success": true, "count": 2, "data": [...] }
```

---

### GET /api/notes/:id
**Get a single note**
```
GET http://localhost:3000/api/notes/<id>
```

---

### POST /api/notes
**Create a new note**
```
POST http://localhost:3000/api/notes
Content-Type: application/json

{
  "title": "My Note",
  "content": "This is the body of my note.",
  "color": "#FFF9C4"
}
```
`color` is optional. Returns `201 Created`.

---

### PUT /api/notes/:id
**Update a note**
```
PUT http://localhost:3000/api/notes/<id>
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content",
  "color": "#C8E6C9"
}
```
All fields are optional — only send what you want to change.

---

### DELETE /api/notes/:id
**Delete a note**
```
DELETE http://localhost:3000/api/notes/<id>
```
Returns `200 OK` with a success message.

---

## 🎨 Note Colors

Use any hex color for the `color` field. Suggested palette:
- `#FFFFFF` — White
- `#FFF9C4` — Yellow
- `#C8E6C9` — Green
- `#BBDEFB` — Blue
- `#F8BBD0` — Pink
- `#E1BEE7` — Purple
- `#FFE0B2` — Orange
- `#D7CCC8` — Brown

---

## 🛠 Tech Stack

- **Next.js 15** App Router
- **TypeScript**
- **Tailwind CSS**
- **In-memory store** (data resets on server restart — swap `lib/db.ts` for a real DB)

---

## 📁 Project Structure

```
app/
  api/
    notes/
      route.ts          # GET all, POST
      [id]/route.ts     # GET one, PUT, DELETE
  page.tsx              # Main UI
  layout.tsx
  globals.css
lib/
  db.ts                 # In-memory data store
types/
  note.ts               # TypeScript types
```
