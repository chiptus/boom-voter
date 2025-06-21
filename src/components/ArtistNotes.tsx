import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Edit3, Save, X, StickyNote } from "lucide-react";
import { useArtistNotes } from "@/hooks/useArtistNotes";

interface ArtistNotesProps {
  artistId: string;
  userId: string | null;
}

export const ArtistNotes = ({ artistId, userId }: ArtistNotesProps) => {
  const { note, loading, saving, saveNote, deleteNote } = useArtistNotes(artistId, userId);
  const [isEditing, setIsEditing] = useState(false);
  const [noteContent, setNoteContent] = useState(note?.note_content || "");

  if (!userId) {
    return (
      <Card className="bg-white/10 backdrop-blur-md border-purple-400/30">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <StickyNote className="h-5 w-5" />
            <span>Personal Notes</span>
          </CardTitle>
          <CardDescription className="text-purple-200">
            Sign in to add personal notes about this artist
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const handleSave = async () => {
    const success = await saveNote(noteContent.trim());
    if (success) {
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      const success = await deleteNote();
      if (success) {
        setNoteContent("");
        setIsEditing(false);
      }
    }
  };

  const handleStartEdit = () => {
    setNoteContent(note?.note_content || "");
    setIsEditing(true);
  };

  const handleCancel = () => {
    setNoteContent(note?.note_content || "");
    setIsEditing(false);
  };

  if (loading) {
    return (
      <Card className="bg-white/10 backdrop-blur-md border-purple-400/30">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <StickyNote className="h-5 w-5" />
            <span>Personal Notes</span>
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
              <StickyNote className="h-5 w-5" />
              <span>Personal Notes</span>
            </CardTitle>
            <CardDescription className="text-purple-200">
              Your private notes about this artist
            </CardDescription>
          </div>
          {!isEditing && note && (
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleStartEdit}
                className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white"
              >
                <Edit3 className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white"
                disabled={saving}
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
              placeholder="Add your thoughts about this artist..."
              className="min-h-[120px] bg-white/5 border-purple-400/30 text-white placeholder:text-purple-300"
            />
            <div className="flex items-center space-x-2">
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
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        ) : note ? (
          <div className="space-y-2">
            <div className="text-white whitespace-pre-wrap break-words">
              {note.note_content}
            </div>
            <div className="text-sm text-purple-300">
              Last updated: {new Date(note.updated_at).toLocaleDateString()}
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="text-purple-200 mb-4">No notes yet</div>
            <Button
              onClick={() => setIsEditing(true)}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Add Note
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};