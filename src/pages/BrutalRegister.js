/**
 * BRUTAL REGISTER
 * Commit or quit.
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/auth/AuthContext';

const BrutalRegister = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.email || !formData.password || !formData.role) {
      setError('COMPLETE ALL FIELDS OR LEAVE');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const success = await register(
        formData.email,
        formData.password,
        formData.fullName,
        formData.role
      );
      
      if (success) {
        navigate('/dashboard');
      } else {
        setError('FAILED. TRY DIFFERENT DATA.');
      }
    } catch (err) {
      setError('SYSTEM REJECTED YOU. TRY AGAIN.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="brutal-register">
      <section className="section">
        <h1>COMMIT NOW</h1>
        <p>NO TURNING BACK</p>
      </section>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="section">
        <div>
          <label htmlFor="fullName">NAME</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="FULL NAME"
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="email">EMAIL</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="YOUR@EMAIL.COM"
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="password">PASSWORD</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="MAKE IT STRONG"
            disabled={loading}
          />
        </div>

        <div>
          <h3>CHOOSE YOUR PATH</h3>
          <div className="binary-choice">
            <label className={`btn ${formData.role === 'designer' ? 'btn-primary' : ''}`}>
              <input
                type="radio"
                name="role"
                value="designer"
                checked={formData.role === 'designer'}
                onChange={handleChange}
                style={{ display: 'none' }}
              />
              I CREATE
            </label>
            <label className={`btn ${formData.role === 'producer' ? 'btn-primary' : ''}`}>
              <input
                type="radio"
                name="role"
                value="producer"
                checked={formData.role === 'producer'}
                onChange={handleChange}
                style={{ display: 'none' }}
              />
              I PRODUCE
            </label>
          </div>
        </div>

        <div className="binary-choice">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'PROCESSING...' : 'COMMIT'}
          </button>
          <Link to="/" className="btn btn-danger">
            ABORT
          </Link>
        </div>
      </form>

      <section className="section">
        <h2>ALREADY IN?</h2>
        <Link to="/login" className="btn">
          LOGIN NOW
        </Link>
      </section>

      <section className="section">
        <h2>THE TRUTH</h2>
        <ol>
          <li>WE DON'T SPAM. WE DELIVER.</li>
          <li>YOUR DATA IS YOURS. WE JUST CONNECT.</li>
          <li>NO FLUFF. JUST BUSINESS.</li>
          <li>CANCEL ANYTIME. NO BEGGING.</li>
        </ol>
      </section>

      <section className="section">
        <blockquote>
          "THE BEST TIME WAS YESTERDAY. THE NEXT BEST IS NOW."
        </blockquote>
      </section>
    </div>
  );
};

export default BrutalRegister;