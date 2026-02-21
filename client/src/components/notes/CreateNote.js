import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

export default function CreateNote() {
  const [note, setNote] = useState({
    title: '',
    content: '',
    tags: '',
    date: '',
  });
  const history = useHistory();

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setNote({ ...note, [name]: value });
  };

  const createNote = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('tokenStore');
      if (token) {
        const { title, content, date } = note;
        const { tags } = note;
        const newNote = { title, content, date, tags };

        await axios.post('/api/notes', newNote, {
          headers: { Authorization: token },
        });

        return history.push('/');
      }
    } catch (err) {
      window.location.href = '/';
    }
  };

  return (
    <div className="page">
      <div className="form-card">
        <div className="form-head">
          <h2>Create Note</h2>
          <p>Write something you’ll want to remember.</p>
        </div>

        <form onSubmit={createNote} autoComplete="off" className="form">
          <div className="field">
            <label htmlFor="title">Title</label>
            <input type="text" value={note.title} id="title" name="title" required onChange={onChangeInput} />
          </div>

          <div className="field">
            <label htmlFor="content">Content</label>
            <textarea value={note.content} id="content" name="content" required rows="10" onChange={onChangeInput} />
          </div>

          <div className="field">
            <label htmlFor="tags">Tags</label>
            <input
              type="text"
              value={note.tags}
              id="tags"
              name="tags"
              placeholder="work, study, personal"
              onChange={onChangeInput}
            />
            <div className="field-hint">Tip: add tags like <b>#work</b>, <b>#study</b>, <b>#personal</b></div>
          </div>

          <div className="field">
            <label htmlFor="date">Date</label>
            <input type="date" id="date" name="date" onChange={onChangeInput} />
          </div>

          <div className="form-actions">
            <button type="button" className="btn" onClick={() => history.push('/')}>
              Cancel
            </button>
            <button type="submit" className="btn primary">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
