import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

export default function EditNote({ match }) {
  const [note, setNote] = useState({
    title: '',
    content: '',
    tags: '',
    date: '',
    id: '',
  });
  const history = useHistory();

  useEffect(() => {
    const getNote = async () => {
      const token = localStorage.getItem('tokenStore');
      if (match.params.id) {
        const res = await axios.get(`/api/notes/${match.params.id}`, {
          headers: { Authorization: token },
        });
        setNote({
          title: res.data.title,
          content: res.data.content,
          tags: (res.data.tags || []).join(', '),
          date: res.data.date ? new Date(res.data.date).toISOString().slice(0, 10) : '',
          id: res.data._id,
        });
      }
    };
    getNote();
  }, [match.params.id]);

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setNote({ ...note, [name]: value });
  };

  const editNote = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('tokenStore');
      if (token) {
        const { title, content, date, id } = note;
        const { tags } = note;
        const newNote = { title, content, date, tags };

        await axios.put(`/api/notes/${id}`, newNote, {
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
          <h2>Edit Note</h2>
          <p>Update your note and save changes.</p>
        </div>

        <form onSubmit={editNote} autoComplete="off" className="form">
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
            <input type="date" id="date" name="date" value={note.date} onChange={onChangeInput} />
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
