import React, { useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

import '../assets/css/register.css';
import logo from '../assets/vendor/todo_logo.gif';
import '../assets/css/App.css';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const resetMessages = () => {
    setError('');
    setSuccess('');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    resetMessages();
    try {
      await axios.post('/auth/register/', { email, password });
      setSuccess('Registration successful!');
      setTimeout(() => {
        navigate('/login');
      }, 1500); // delay to show success message
    } catch {
      setError('Invalid email or password');
    }
  };

  const goToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <img src={logo} alt="Logo" className="logo" />
        <h2 className="title">Register Here</h2>
        <form onSubmit={handleRegister} className="form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Register</button>
        </form>

        <p>
          Already have an account?{' '}
          <span className="link" onClick={(e) => {
            e.preventDefault();
            goToLogin();
          }}>
            Login
          </span>
        </p>

        {error && <p className="msg error">{error}</p>}
        {success && <p className="msg success">{success}</p>}
      </div>
    </div>
  );
}

export default Register;
