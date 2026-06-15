export interface Note {
  id: string;
  title: string;
  content: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoteDto {
  title: string;
  content: string;
  color?: string;
}

export interface UpdateNoteDto {
  title?: string;
  content?: string;
  color?: string;
}
