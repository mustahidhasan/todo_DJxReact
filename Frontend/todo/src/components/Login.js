import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import '../assets/css/login.css';
import logo from '../assets/vendor/todo_logo.gif';

function Login() {
  const [step, setStep] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');
  const [uid, setUid] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [authToken, setAuthToken] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const resetMessages = () => {
    setError('');
    setSuccess('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    resetMessages();
    try {
      const res = await axios.post('/auth/login/', { email, password });
      setAuthToken(res.data.tokens.access);
      setSuccess('Login successful');
      localStorage.setItem('tokens', JSON.stringify(res.data.tokens));
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/');
    } catch {
      setError('Invalid email or password');
    }
  };

  const handleForgot = async () => {
    resetMessages();
    try {
      const res = await axios.post('/auth/forgot-password/', { email: forgotEmail });
      setUid(res.data.uidb64);
      setToken(res.data.token);
      setSuccess('Reset token received.');
      setStep('reset');
    } catch {
      setError('Failed to send reset link');
    }
  };

  const handleReset = async () => {
    resetMessages();
    try {
      await axios.post('/auth/reset-password/', {
        uidb64: uid,
        token,
        new_password: newPassword,
      });
      setSuccess('Password reset successful');
      setStep('login');
    } catch {
      setError('Reset failed');
    }
  };

  const handleChange = async () => {
    resetMessages();
    try {
      await axios.post(
        '/auth/change-password/',
        { old_password: oldPassword, new_password: newPassword },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setSuccess('Password changed');
    } catch {
      setError('Change failed');
    }
  };

  const goToRegister = () => {
    console.log('Navigating to /register');
    navigate('/register');
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        {step === 'login' && (
          <>
            <img src={logo} alt="Logo" className="logo" />
            <h2 className="title">Welcome Back</h2>
            <form onSubmit={handleLogin} className="form">
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
              <button type="submit">Login</button>
            </form>

            <p className="link" onClick={() => setStep('forgot')}>
              Forgot Password?
            </p>

            <p>
              Don't have an account?{' '}
              <span
                className="link"
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.preventDefault();
                  goToRegister();
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') goToRegister();
                }}
              >
                Register
              </span>
            </p>
          </>
        )}

        {step === 'forgot' && (
          <>
            <h2 className="title">Forgot Password</h2>
            <input
              type="email"
              placeholder="Enter your email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
            />
            <button type="button" onClick={handleForgot}>Send Reset Link</button>
            <button type="button" className="secondary" onClick={() => setStep('login')}>
              Back
            </button>
          </>
        )}

        {step === 'reset' && (
          <>
            <h2 className="title">Reset Password</h2>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button type="button" onClick={handleReset}>Reset</button>
          </>
        )}

        {step === 'change' && (
          <>
            <h2 className="title">Change Password</h2>
            <input
              type="password"
              placeholder="Old Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button type="button" onClick={handleChange}>Change</button>
            <button type="button" className="secondary" onClick={() => setStep('login')}>
              Logout
            </button>
          </>
        )}

        {error && <p className="msg error">{error}</p>}
        {success && <p className="msg success">{success}</p>}
      </div>
    </div>
  );
}

export default Login;
