import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './ForumPage.css';

const ForumPage = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', body: '' });
  const loggedInUserEmail = localStorage.getItem('userEmail');

  useEffect(() => {
    fetch(`https://jsonplaceholder.typicode.com/posts`)
      .then(response => response.json())
      .then(data => {
        fetch(`https://jsonplaceholder.typicode.com/users`)
          .then(userResponse => userResponse.json())
          .then(usersData => {
            const userEmails = {};
            usersData.forEach(user => {
              userEmails[user.id] = user.email;
            });

            const postsWithAuthors = data.map(post => ({
              ...post,
              authorEmail: userEmails[post.userId]
            }));

            setPosts(postsWithAuthors);
          });
      });
  }, []);

  const handleNewPostChange = (e) => {
    const { name, value } = e.target;
    setNewPost({ ...newPost, [name]: value });
  };

  const handleAddPost = (e) => {
    e.preventDefault();
    if (!newPost.title || !newPost.body) {
      alert('Tytuł i treść posta są wymagane.');
      return;
    }

    fetch(`https://jsonplaceholder.typicode.com/posts`, {
      method: 'POST',
      body: JSON.stringify({
        ...newPost,
        userId: loggedInUserEmail,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
    .then(response => response.json())
    .then(data => {
      setPosts([{ ...data, authorEmail: loggedInUserEmail }, ...posts]);
      setNewPost({ title: '', body: '' });
    });
  };

  const handleDeletePost = (postId) => {
    fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`, {
      method: 'DELETE',
    })
    .then(() => {
      setPosts(posts.filter(post => post.id !== postId));
    });
  };

  return (
    <div className="forum-page">
      <form onSubmit={handleAddPost} className="add-post-form">
        <input
          type="text"
          name="title"
          placeholder="Tytuł posta"
          value={newPost.title}
          onChange={handleNewPostChange}
          required
        />
        <textarea
          name="body"
          placeholder="Treść posta"
          value={newPost.body}
          onChange={handleNewPostChange}
          required
        />
        <button type="submit">Dodaj post</button>
      </form>
      {posts.map(post => (
        <div key={post.id} className="post-preview">
          <h3><Link to={`/posts/${post.id}`}>{post.title}</Link></h3>
          <p>{post.body}</p>
          <p className="post-author">Autor: {post.authorEmail}</p>
          {post.authorEmail === loggedInUserEmail && (
            <button onClick={() => handleDeletePost(post.id)} className="delete-post-button">
              Usuń post
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default ForumPage;