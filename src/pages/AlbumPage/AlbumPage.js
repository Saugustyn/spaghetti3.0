import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './AlbumPage.css';

const AlbumPage = () => {
  const { albumId } = useParams();
  const loggedInUserId = localStorage.getItem('userId');
  const [album, setAlbum] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoTitle, setNewPhotoTitle] = useState('');

  useEffect(() => {
    fetch(`https://jsonplaceholder.typicode.com/albums/${albumId}`)
      .then(response => response.json())
      .then(data => {
        setAlbum(data);
        if (data) {
          fetch(`https://jsonplaceholder.typicode.com/photos?albumId=${albumId}`)
            .then(response => response.json())
            .then(setPhotos);
        }
      });
  }, [albumId]);

  const handleAddPhoto = (e) => {
    e.preventDefault();
    const newPhoto = {
      albumId: Number(albumId),
      title: newPhotoTitle,
      url: newPhotoUrl,
      thumbnailUrl: newPhotoUrl,
    };

    fetch('https://jsonplaceholder.typicode.com/photos', {
      method: 'POST',
      body: JSON.stringify(newPhoto),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
    .then(response => response.json())
    .then(data => {
      setPhotos(photos.concat(data));
      setNewPhotoUrl('');
      setNewPhotoTitle('');
    });
  };

  const handleDeletePhoto = (photoId) => {
    fetch(`https://jsonplaceholder.typicode.com/photos/${photoId}`, {
      method: 'DELETE',
    })
    .then(() => {
      setPhotos(photos.filter(photo => photo.id !== photoId));
    });
  };

  return (
    <div className="album-page">
      <h2>Zdjęcia w albumie: {album?.title}</h2>
      {album?.userId && album.userId.toString() === loggedInUserId && (
        <form onSubmit={handleAddPhoto} className="add-photo-form">
          <input
            type="text"
            placeholder="URL zdjęcia"
            value={newPhotoUrl}
            onChange={(e) => setNewPhotoUrl(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Tytuł zdjęcia"
            value={newPhotoTitle}
            onChange={(e) => setNewPhotoTitle(e.target.value)}
            required
          />
          <button type="submit">Dodaj zdjęcie</button>
        </form>
      )}
      <div className="photos-grid">
      {photos.map(photo => (
        <div key={photo.id} className="photo-item">
          {album?.userId && album.userId.toString() === loggedInUserId && (
            <button
              onClick={() => handleDeletePhoto(photo.id)}
              className="delete-button"
            >
              Usuń zdjęcie
            </button>
          )}
          <img src={photo.url} alt={photo.title} />
          <p>{photo.title}</p>
        </div>
        ))}
      </div>
    </div>
  );
};

export default AlbumPage;