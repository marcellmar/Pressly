/**
 * BRUTAL LOGIN
 * In or out. No middle ground.
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/auth/AuthContext';

const BrutalLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('FILL ALL FIELDS OR LEAVE');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const success = await login(email, password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('WRONG. TRY AGAIN OR QUIT.');
      }
    } catch (err) {
      setError('FAILED. CHECK YOUR DATA.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="brutal-login">
      <section className="section">
        <h1>GET IN</h1>
        <p>NO ACCESS WITHOUT CREDENTIALS</p>
      </section>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="section">
        <div>
          <label htmlFor="email">EMAIL</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="YOUR@EMAIL.COM"
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="password">PASSWORD</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            disabled={loading}
          />
        </div>

        <div className="binary-choice">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'CHECKING...' : 'IN'}
          </button>
          <Link to="/" className="btn">
            OUT
          </Link>
        </div>
      </form>

      <section className="section">
        <h2>NO ACCOUNT?</h2>
        <div className="binary-choice">
          <Link to="/register" className="btn">
            CREATE ONE
          </Link>
          <Link to="/" className="btn btn-danger">
            LEAVE
          </Link>
        </div>
      </section>

      <section className="section">
        <blockquote>
          "HESITATION IS DECISION. YOU ALREADY CHOSE."
        </blockquote>
      </section>
    </div>
  );
};

export default BrutalLogin;