import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    const hardcodedPassword = 'spaghetti';

    if (password !== hardcodedPassword) {
      alert('Niepoprawne hasło');
      return;
    }

    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    const users = await response.json();
    const user = users.find((u) => u.username.toLowerCase() === username.toLowerCase());

    if (user) {
      localStorage.setItem('userId', user.id);
      localStorage.setItem('userEmail', user.email);
      navigate('/home');
    } else {
      alert('Użytkownik nie znaleziony');
    }
  }; 

  return (
    <div className="login-container">
      <form onSubmit={handleLogin}>
        <label>Nazwa użytkownika:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <label>Hasło:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Zaloguj się</button>
      </form>
    </div>
  );
};

export default LoginPage;