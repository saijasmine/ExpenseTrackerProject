import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      if (response.status === 400) {
        setMessage("Password too weak! Use 8+ chars, uppercase, numbers & symbols.");
        setLoading(false);
        return;
      }

      const data = await response.text();

      if (response.ok) {
        setMessage(isLogin ? "Login Successful! Redirecting..." : "Account Created! Please login.");
        
        if (isLogin) {
          setTimeout(() => {
            navigate('/dashboard');
          }, 1000);
        } else {
          setTimeout(() => {
            setIsLogin(true);
            setLoading(false);
            setFormData({ email: '', password: '' });
          }, 2000);
        }
      } else {
        setMessage(data || "Invalid credentials. Please try again.");
        setLoading(false);
      }
    } catch (err) {
      console.error("Connection Detailed Error:", err);
      setMessage("Connection failed. Please check your internet or server status.");
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isLogin ? 'Welcome Back' : 'Mindful Spends'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input 
              type="email" 
              name="email" 
              placeholder="Email Address" 
              value={formData.email}
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="input-group">
            <input 
              type="password" 
              name="password" 
              placeholder="Password" 
              value={formData.password}
              onChange={handleChange} 
              required 
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
          </button>
        </form>
        <p className="toggle-text" onClick={() => { setIsLogin(!isLogin); setMessage(''); }}>
          {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
        </p>
        {message && (
          <div className={`message-box ${message.includes('Successful') || message.includes('Created') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;
