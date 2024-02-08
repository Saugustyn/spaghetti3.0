import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (searchTerm) {
      fetch(`https://jsonplaceholder.typicode.com/users?name_like=${searchTerm}`)
        .then(response => response.json())
        .then(data => {
          setSearchResults(data);
        });
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  const handleLogout = () => {
    localStorage.removeItem('userId');
    navigate('/');
  };

  return (
    <nav className="navbar">
      {location.pathname !== '/' && (
        <Link to="/home" className="nav-link">
          Strona główna
        </Link>
      )}
      <div className="nav-links">
        {localStorage.getItem('userId') && (
          <>
          <div className="navbar-search">
        <input
          type="text"
          placeholder="Szukaj użytkowników..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        {searchResults.length > 0 && (
          <ul className="search-results">
            {searchResults.map((user) => (
              <li key={user.id} onClick={() => {
                setSearchTerm('');
                setSearchResults([]);
                navigate(`/profile/${user.id}`);
              }}>
                {user.name}
              </li>
            ))}
          </ul>
        )}
      </div>
            <Link to={`/profile/${localStorage.getItem('userId')}`} className="nav-link">
              Twój profil
            </Link>
            <button onClick={handleLogout} className="nav-link logout-btn">
              Wyloguj się
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;