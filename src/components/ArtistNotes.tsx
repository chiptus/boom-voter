import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Save, Trash2, FileText } from "lucide-react";
import { useArtistNotes } from "@/hooks/useArtistNotes";

interface ArtistNotesProps {
  artistId: string;
  userId: string | null;
}

export const ArtistNotes = ({ artistId, userId }: ArtistNotesProps) => {
  const { note, loading, saving, saveNote, deleteNote } = useArtistNotes(artistId, userId);
  const [isEditing, setIsEditing] = useState(false);
  const [noteContent, setNoteContent] = useState("");

  if (!userId) {
    return (
      <Card className="bg-white/10 backdrop-blur-md border-purple-400/30">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <FileText className="h-5 w-5" />
            <span>My Notes</span>
          </CardTitle>
          <CardDescription className="text-purple-200">
            Sign in to add personal notes about this artist
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const handleEdit = () => {
    setNoteContent(note?.note_content || "");
    setIsEditing(true);
  };

  const handleSave = async () => {
    await saveNote(noteContent);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setNoteContent("");
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      await deleteNote();
    }
  };

  if (loading) {
    return (
      <Card className="bg-white/10 backdrop-blur-md border-purple-400/30">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <FileText className="h-5 w-5" />
            <span>My Notes</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-purple-200">Loading notes...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/10 backdrop-blur-md border-purple-400/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2 text-white">
              <FileText className="h-5 w-5" />
              <span>My Notes</span>
            </CardTitle>
            <CardDescription className="text-purple-200">
              Personal notes about this artist (only visible to you)
            </CardDescription>
          </div>
          {note && !isEditing && (
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleEdit}
                className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                disabled={saving}
                className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <Textarea
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Add your personal notes about this artist..."
              className="min-h-[100px] bg-white/5 border-purple-400/30 text-white placeholder:text-purple-300"
            />
            <div className="flex space-x-2">
              <Button
                onClick={handleSave}
                disabled={saving || !noteContent.trim()}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Saving..." : "Save Note"}
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={saving}
                className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : note ? (
          <div className="prose prose-invert max-w-none">
            <p className="text-purple-100 whitespace-pre-wrap">{note.note_content}</p>
            <p className="text-sm text-purple-300 mt-4">
              Last updated: {new Date(note.updated_at).toLocaleDateString()}
            </p>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-purple-200 mb-4">No notes yet for this artist</p>
            <Button
              onClick={handleEdit}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Edit className="h-4 w-4 mr-2" />
              Add Note
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};