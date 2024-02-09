import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './PostPage.css';

const PostPage = () => {
  const { postId } = useParams();
  const loggedInUserEmail = localStorage.getItem('userEmail');
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`)
      .then(response => response.json())
      .then(setPost);

    fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`)
      .then(response => response.json())
      .then(setComments);
  }, [postId]);

  const handleAddComment = (e) => {
    e.preventDefault();
    const commentToPost = {
      postId: Number(postId),
      body: newComment,
      email: loggedInUserEmail,
    };
    fetch(`https://jsonplaceholder.typicode.com/comments`, {
      method: 'POST',
      body: JSON.stringify(commentToPost),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
    .then(response => response.json())
    .then(data => {
        const commentWithUserEmail = { ...data, email: loggedInUserEmail };
        setComments(comments.concat(commentWithUserEmail));
        setNewComment('');
    });
  };

  const handleDeleteComment = (commentId) => {
    fetch(`https://jsonplaceholder.typicode.com/comments/${commentId}`, {
      method: 'DELETE',
    })
    .then(() => {
      setComments(comments.filter(comment => comment.id !== commentId));
    });
  };

  if (!post) return <p>Loading post...</p>;

  return (
    <div className="post-page">
      <div className="post">
        <h1>{post.title}</h1>
        <p>{post.body}</p>
      </div>
      <div className="comments">
        <h2>Komentarze</h2>
        {comments.map(comment => (
          <div key={comment.id} className="comment">
            <p>{comment.body}</p>
            <p>{comment.email}</p>
            {comment.email === loggedInUserEmail && (
              <div style={{marginTop: "10px"}}>
                <button onClick={() => handleDeleteComment(comment.id)} className="delete-comment">
                  Usuń
                </button>
              </div>
            )}
          </div>
        ))}
        <form onSubmit={handleAddComment} className="add-comment-form">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            required
            placeholder="Napisz komentarz..."
          />
          <button type="submit">Dodaj komentarz</button>
        </form>
      </div>
    </div>
  );  
  
};

export default PostPage;