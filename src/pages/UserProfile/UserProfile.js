import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './UserProfile.css';

const UserProfile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [editEmail, setEditEmail] = useState(false);
  const [editPhone, setEditPhone] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const loggedInUserId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
      const userData = await response.json();
      setUser(userData);
      setNewEmail(userData.email);
      setNewPhone(userData.phone);
    };

    const fetchPosts = async () => {
      const response = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
      const postData = await response.json();
      setPosts(postData);
    };

    const fetchPhotos = async () => {
      const albumsResponse = await fetch(`https://jsonplaceholder.typicode.com/albums?userId=${userId}`);
      const albums = await albumsResponse.json();
      const photosPromises = albums.map(album =>
        fetch(`https://jsonplaceholder.typicode.com/photos?albumId=${album.id}`).then(response => response.json())
      );
      const photosArrays = await Promise.all(photosPromises);
      setPhotos(photosArrays.flat());
    };

    fetchUser();
    fetchPosts();
    fetchPhotos();
  }, [userId]);

  const handleEdit = (field) => {
    if (field === 'email') {
      setEditEmail(!editEmail);
    } else if (field === 'phone') {
      setEditPhone(!editPhone);
    }
  };

  const handleSave = async (field) => {
    if (field === 'email' && newEmail !== user.email) {
      setUser(prev => ({ ...prev, email: newEmail }));
      setEditEmail(false);
      await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`, {
        method: 'PATCH',
        body: JSON.stringify({ email: newEmail }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
    } else if (field === 'phone' && newPhone !== user.phone) {
      setUser(prev => ({ ...prev, phone: newPhone }));
      setEditPhone(false);
      await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`, {
        method: 'PATCH',
        body: JSON.stringify({ phone: newPhone }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
    }
  };

  if (!user) return <p>Loading profile...</p>;

  return (
    <div className="user-profile">
      <table className="user-details">
        <tbody>
          <tr>
            <th>ID</th>
            <td>{user.id}</td>
          </tr>
          <tr>
            <th>Name</th>
            <td>{user.name}</td>
          </tr>
          <tr>
            <th>Username</th>
            <td>{user.username}</td>
          </tr>
          <tr>
            <th>Email</th>
            <td>
              {editEmail ? (
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
              ) : (
                <span>{user.email}</span>
              )}
              {loggedInUserId && loggedInUserId === user.id.toString() && (
                 <button onClick={() => editEmail ? handleSave('email') : handleEdit('email')}>
                 {editEmail ? 'Zapisz' : 'Edytuj'}
               </button>
              )}
            </td>
          </tr>
          <tr>
            <th>Address</th>
            <td>
              {user.address.street}, {user.address.suite},
              <br />
              {user.address.city}, {user.address.zipcode}
              <br />
              Geo: {user.address.geo.lat}, {user.address.geo.lng}
            </td>
          </tr>
          <tr>
            <th>Phone</th>
            <td>
              {editPhone ? (
                <input
                  type="tel"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                />
              ) : (
                <span>{user.phone}</span>
              )}
              {loggedInUserId && loggedInUserId === user.id.toString() && (
                <button onClick={() => handleEdit('phone')}>
                  {editPhone ? 'Anuluj' : 'Edytuj'}
                </button>
              )}
            </td>
          </tr>
          <tr>
            <th>Website</th>
            <td>
              <a href={`http://${user.website}`} target="_blank" rel="noopener noreferrer">
                {user.website}
              </a>
            </td>
          </tr>
          <tr>
            <th>Company</th>
            <td>
              {user.company.name}
              <br />
              {user.company.catchPhrase}
              <br />
              {user.company.bs}
            </td>
          </tr>
        </tbody>
      </table>
  
      <div className="content">
        <div className="photos">
          <h2>Photos</h2>
          {photos.map(photo => (
            <img key={photo.id} src={photo.thumbnailUrl} alt={photo.title} />
          ))}
        </div>
        <div className="posts">
          <h2>Posts</h2>
          {posts.map(post => (
            <div key={post.id}>
              <h3>
                <Link to={`/posts/${post.id}`}>{post.title}</Link>
              </h3>
              <p>{post.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;