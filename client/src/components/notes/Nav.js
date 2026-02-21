import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Nav({
  setIsLogin,
  searchQuery,
  setSearchQuery,
  selectedTags,
  toggleTag,
  availableTags,
  clearFilters,
}) {
  const location = useLocation();

  const logoutSubmit = () => {
    localStorage.clear();
    setIsLogin(false);
  };

  const linkClass = (path) => (location.pathname === path ? 'side-link active' : 'side-link');

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <Link to="/" className="sidebar-brand" aria-label="Go to Sticky Wall">
          <div className="brand-mark">🗒️</div>
          <div className="brand-copy">
            <div className="brand-title">Sticky Wall</div>
            <div className="brand-sub">Quick notes. Clean layout.</div>
          </div>
        </Link>

        <div className="sidebar-search" aria-label="Search notes">
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {(searchQuery || (selectedTags && selectedTags.length)) && (
            <button type="button" className="search-clear" onClick={clearFilters} title="Clear search & filters">
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-label">Menu</div>
        <div className="sidebar-links">
          <Link to="/" className={linkClass('/')}>
            <span className="side-ic">🏠</span>
            <span>Sticky Wall</span>
          </Link>
          <Link to="/create" className={linkClass('/create')}>
            <span className="side-ic">＋</span>
            <span>New Note</span>
          </Link>
        </div>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-label">Tags</div>
        <div className="tag-pills">
          <button
            type="button"
            className={selectedTags && selectedTags.length ? 'tag-pill' : 'tag-pill active'}
            onClick={() => clearFilters()}
            title="Show all notes"
          >
            All
          </button>

          {(availableTags || []).map((t) => (
            <button
              key={t}
              type="button"
              className={selectedTags && selectedTags.includes(t) ? 'tag-pill active' : 'tag-pill'}
              onClick={() => toggleTag(t)}
              title={`Filter by #${t}`}
            >
              #{t}
            </button>
          ))}
        </div>
        <div className="sidebar-hint">Tip: add tags like <b>#work</b>, <b>#study</b> on a note.</div>
      </div>

      <div className="sidebar-footer">
        <button type="button" className="side-btn" onClick={logoutSubmit}>
          Sign out
        </button>
      </div>
    </aside>
  );
}
