import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const tones = ['yellow', 'mint', 'pink', 'blue'];

const demoNotes = [
  {
    tone: 'yellow',
    title: 'Add notes here ✨',
    content:
      'Create your first note using the “New Note” button on the left.\n\nTip: keep titles short, and put details in the body.',
    date: '',
  },
  {
    tone: 'mint',
    title: 'Sample checklist',
    content: '• Buy groceries\n• Gym\n• Finish assignment\n• Call family',
    date: '',
  },
  {
    tone: 'blue',
    title: 'Pinned idea',
    content: 'Try grouping notes by tags (Work / Study / Personal).\nWe can add filtering next.',
    date: '',
  },
];

export default function Home({ searchQuery = '', selectedTags = [], setAvailableTags }) {
  const [notes, setNotes] = useState([]);

  const token = useMemo(() => localStorage.getItem('tokenStore'), []);

  const getNotes = async () => {
    try {
      if (!token) return;
      const res = await axios.get('/api/notes', {
        headers: { Authorization: token },
      });
      setNotes(res.data || []);
    } catch (err) {
      // If token expires, backend may reject; keep UI safe
      setNotes([]);
    }
  };

  useEffect(() => {
    getNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // push tag list up to sidebar
  useEffect(() => {
    if (typeof setAvailableTags !== 'function') return;
    const tags = new Set();
    (notes || []).forEach((n) => {
      (n.tags || []).forEach((t) => {
        const cleaned = String(t || '').trim().toLowerCase();
        if (cleaned) tags.add(cleaned);
      });
    });
    setAvailableTags(Array.from(tags).sort());
  }, [notes, setAvailableTags]);

  const deleteNote = async (id) => {
    try {
      if (!token) return;
      await axios.delete(`/api/notes/${id}`, {
        headers: { Authorization: token },
      });
      getNotes();
    } catch (err) {
      // noop
    }
  };

  const renderCard = (note, idx, isDemo = false) => {
    const tone = note.tone || tones[idx % tones.length];
    const dateText = note.date ? new Date(note.date).toLocaleDateString() : '';
    return (
      <article key={note._id || `demo-${idx}`} className={`note-card note-card--${tone} ${isDemo ? 'note-card--demo' : ''}`}>
        <div className="note-card-top">
          <h3 className="note-title">{note.title}</h3>
          {!isDemo && (
            <Link className="note-link" to={`/edit/${note._id}`} aria-label="Edit note">
              ✎
            </Link>
          )}
        </div>

        <p className="note-content">{note.content}</p>

        {!isDemo && (note.tags || []).length > 0 && (
          <div className="note-tags" aria-label="Tags">
            {(note.tags || []).slice(0, 6).map((t) => (
              <span key={t} className="note-tag">#{String(t).trim().toLowerCase()}</span>
            ))}
            {(note.tags || []).length > 6 && <span className="note-tag note-tag--more">+{(note.tags || []).length - 6}</span>}
          </div>
        )}

        <div className="note-footer">
          <span className="note-date">{isDemo ? 'Sample' : dateText}</span>
          {!isDemo && (
            <button className="note-del" onClick={() => deleteNote(note._id)} aria-label="Delete note">
              Delete
            </button>
          )}
        </div>
      </article>
    );
  };

  const isEmpty = !notes || notes.length === 0;

  const q = String(searchQuery || '').trim().toLowerCase();
  const activeTags = (selectedTags || []).map((t) => String(t || '').trim().toLowerCase()).filter(Boolean);

  const filteredNotes = (notes || []).filter((n) => {
    const title = String(n.title || '').toLowerCase();
    const content = String(n.content || '').toLowerCase();
    const matchesQuery = !q || title.includes(q) || content.includes(q);

    const noteTags = (n.tags || []).map((t) => String(t || '').trim().toLowerCase());
    const matchesTags = !activeTags.length || activeTags.every((t) => noteTags.includes(t));

    return matchesQuery && matchesTags;
  });

  return (
    <div className="page">
      <div className="page-top">
        <div>
          <h1 className="page-title">My Notes</h1>
          <p className="page-sub">Everything in one place. Click a card to edit.</p>
        </div>

        <Link to="/create" className="btn primary">
          + Add note
        </Link>
      </div>

      {isEmpty ? (
        <>
          <div className="empty-state">
            <div className="empty-title">No notes yet</div>
            <div className="empty-sub">Start by adding a note. Here are a few samples.</div>
          </div>

          <div className="note-grid">
            {demoNotes.map((n, i) => renderCard(n, i, true))}
          </div>
        </>
      ) : (
        <>
          <div className="note-grid">
            {filteredNotes.map((note, idx) => renderCard(note, idx, false))}
          </div>
          {filteredNotes.length === 0 && (
            <div className="empty-state" style={{ marginTop: 16 }}>
              <div className="empty-title">No matches</div>
              <div className="empty-sub">Try clearing search or tags.</div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
