import React from 'react';
import Sidebar from './notes/Nav';
import Home from './notes/Home';
import CreateNote from './notes/CreateNote';
import EditNote from './notes/EditNote';
import { BrowserRouter as Router, Route } from 'react-router-dom';

export default function Notes({ setIsLogin }) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedTags, setSelectedTags] = React.useState([]);
  const [availableTags, setAvailableTags] = React.useState([]);

  const toggleTag = (tag) => {
    const t = String(tag || '').trim().toLowerCase();
    if (!t) return;
    setSelectedTags((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTags([]);
  };

  return (
    <Router>
      <div className="app-shell">
        <Sidebar
          setIsLogin={setIsLogin}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedTags={selectedTags}
          toggleTag={toggleTag}
          availableTags={availableTags}
          clearFilters={clearFilters}
        />

        <main className="main">
          <Route
            path="/"
            exact
            render={(props) => (
              <Home
                {...props}
                searchQuery={searchQuery}
                selectedTags={selectedTags}
                setAvailableTags={setAvailableTags}
              />
            )}
          />
          <Route path="/create" component={CreateNote} exact />
          <Route path="/edit/:id" component={EditNote} exact />
        </main>
      </div>
    </Router>
  );
}
