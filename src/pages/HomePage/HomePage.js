import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const [albums, setAlbums] = useState([]);
  const [users, setUsers] = useState([]);
  const [filterUsername, setFilterUsername] = useState('');
  const [filterAlbumId, setFilterAlbumId] = useState('');
  const [filterPhotoId, setFilterPhotoId] = useState('');
  const [filteredAlbums, setFilteredAlbums] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      const data = await response.json();
      setUsers(data);
    };

    const fetchAlbums = async () => {
      const response = await fetch('https://jsonplaceholder.typicode.com/albums');
      const data = await response.json();
      setAlbums(data);
    };

    fetchUsers();
    fetchAlbums();
  }, []);

  useEffect(() => {
    let filtered = albums.filter(album => {
      const user = users.find(user => user.id === album.userId);
      return user ? user.username.toLowerCase().includes(filterUsername.toLowerCase()) : false;
    });

    if (filterAlbumId) {
      filtered = filtered.filter(album => album.id.toString() === filterAlbumId);
    }
    if (filterPhotoId) {
      fetch(`https://jsonplaceholder.typicode.com/photos?id=${filterPhotoId}`)
        .then(response => response.json())
        .then(data => {
          const photoAlbumId = data[0] ? data[0].albumId : null;
          setFilteredAlbums(filtered.filter(album => album.id === photoAlbumId));
        });
    } else {
      setFilteredAlbums(filtered);
    }
  }, [albums, users, filterUsername, filterAlbumId, filterPhotoId]);

  return (
    <div className='home-page'>
      <h1>Witaj w aplikacji!</h1>
      <Link to="/forum" className="go-to-forum-button">
        Przejdź do forum
      </Link>
      <input
        type="text"
        placeholder="Filtruj albumy po użytkowniku..."
        value={filterUsername}
        onChange={(e) => setFilterUsername(e.target.value)}
      />
      <input
        type="text"
        placeholder="Filtruj albumy po numerze albumu..."
        value={filterAlbumId}
        onChange={(e) => setFilterAlbumId(e.target.value)}
      />
      <input
        type="text"
        placeholder="Filtruj albumy po numerze zdjęcia (ID)..."
        value={filterPhotoId}
        onChange={(e) => setFilterPhotoId(e.target.value)}
      />
      <div className="albums">
        {filteredAlbums.map(album => {
          const user = users.find(user => user.id === album.userId);
          return (
            <div key={album.id} className="album">
                <Link to={`/albums/${album.id}${filterPhotoId ? `?photoId=${filterPhotoId}` : ''}`}>
                    <p>{`Album ${album.id}: ${album.title}`}</p>
                    <p>{`Użytkownik: ${user ? user.username : 'Nieznany'}`}</p>
                </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HomePage;