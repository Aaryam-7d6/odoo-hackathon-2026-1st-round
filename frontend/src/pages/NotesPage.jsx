import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Trash2, Edit3, FileText, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { Card, CardBody, Button, Textarea, Modal, EmptyState, Spinner } from '../components/ui';
import { notesApi, tripsApi } from '../api';
import { formatDate } from '../utils';

export default function NotesPage() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [selectedTripId, setSelectedTripId] = useState(tripId || null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [noteContent, setNoteContent] = useState('');

  useEffect(() => { loadTrips(); }, []);

  useEffect(() => {
    if (selectedTripId) loadNotes();
  }, [selectedTripId]);

  const loadTrips = async () => {
    try {
      const res = await tripsApi.list();
      setTrips(res.data);
    } catch { toast.error('Failed to load trips'); }
  };

  const loadNotes = async () => {
    if (!selectedTripId) return;
    setLoading(true);
    try {
      const res = await notesApi.list(selectedTripId);
      setNotes(res.data);
    } catch { toast.error('Failed to load notes'); }
    finally { setLoading(false); }
  };

  const addNote = async () => {
    if (!noteContent.trim()) return;
    try {
      const res = await notesApi.create(selectedTripId, { content: noteContent });
      setNotes([res.data, ...notes]);
      setShowAddModal(false);
      setNoteContent('');
      toast.success('Note added');
    } catch { toast.error('Failed to add note'); }
  };

  const updateNote = async () => {
    if (!noteContent.trim() || !editingNote) return;
    try {
      const res = await notesApi.update(editingNote.id, { content: noteContent });
      setNotes(notes.map(n => n.id === editingNote.id ? res.data : n));
      setEditingNote(null);
      setNoteContent('');
      toast.success('Note updated');
    } catch { toast.error('Failed to update note'); }
  };

  const deleteNote = async (note) => {
    if (!confirm('Delete this note?')) return;
    try {
      await notesApi.delete(note.id);
      setNotes(notes.filter(n => n.id !== note.id));
      toast.success('Note deleted');
    } catch { toast.error('Failed to delete note'); }
  };

  const openEditModal = (note) => {
    setEditingNote(note);
    setNoteContent(note.content);
    setShowAddModal(true);
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingNote(null);
    setNoteContent('');
  };

  if (!tripId && trips.length === 0) {
    return (
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-3xl font-display font-bold text-text-primary">Trip Notes</h1>
        <div className="text-center py-12">
          <p className="text-text-secondary">Create a trip first to add notes</p>
          <Button onClick={() => navigate('/trips/create')} className="mt-4">Create Trip</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-display font-bold text-text-primary">Trip Notes</h1>
        {trips.length > 0 && !tripId && (
          <select
            value={selectedTripId || ''}
            onChange={(e) => setSelectedTripId(Number(e.target.value))}
            className="w-full sm:w-48 px-4 py-2.5 bg-surface border border-border rounded-xl text-text-primary"
          >
            {trips.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        )}
      </div>

      <Button onClick={() => setShowAddModal(true)}>
        <Plus className="w-4 h-4" /> Add Note
      </Button>

      {loading ? (
        <Spinner />
      ) : notes.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No notes yet"
          description="Capture memories, ideas, and reminders for your trip."
          action={<Button onClick={() => setShowAddModal(true)}><Plus className="w-4 h-4" /> Write First Note</Button>}
        />
      ) : (
        <div className="space-y-4">
          {notes.map((note) => (
            <Card key={note.id}>
              <CardBody>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-text-primary whitespace-pre-wrap">{note.content}</p>
                    <div className="flex items-center gap-3 mt-3 text-xs text-text-secondary">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(note.created_at)}
                      </span>
                      {note.updated_at !== note.created_at && (
                        <span>Edited {formatDate(note.updated_at)}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => openEditModal(note)} className="p-2 hover:bg-surface-2 rounded-lg text-text-secondary hover:text-text-primary transition-colors">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => deleteNote(note)} className="p-2 hover:bg-error/10 rounded-lg text-text-secondary hover:text-error transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={showAddModal} onClose={closeModal} title={editingNote ? 'Edit Note' : 'Add Note'}>
        <div className="space-y-4">
          <Textarea
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            placeholder="Write your note..."
            rows={6}
            error={!noteContent.trim() ? 'Note content is required' : ''}
          />
          <Button onClick={editingNote ? updateNote : addNote} className="w-full" disabled={!noteContent.trim()}>
            {editingNote ? 'Update Note' : 'Save Note'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
