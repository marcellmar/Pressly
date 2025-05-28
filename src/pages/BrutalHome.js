/**
 * BRUTAL HOME
 * Truth without comfort
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../services/auth/AuthContext';

const BrutalHome = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="brutal-home">
      {/* MANIFESTO */}
      <section className="section">
        <h1>PRINT OR DIE</h1>
        <p>
          YOUR DESIGN IS WORTHLESS UNTIL IT EXISTS.<br />
          FIND A PRINTER. MAKE IT REAL. OR QUIT.
        </p>
      </section>

      {/* BINARY CHOICE */}
      <section className="section">
        <h2>CHOOSE NOW</h2>
        <div className="binary-choice">
          <Link to="/create" className="btn btn-primary">
            I WILL CREATE
          </Link>
          <Link to="/producers" className="btn">
            I NEED PRODUCTION
          </Link>
        </div>
      </section>

      {/* TRUTH SECTION */}
      <section className="section">
        <h2>THE TRUTH</h2>
        <ol>
          <li>IDEAS ARE WORTHLESS WITHOUT EXECUTION</li>
          <li>PERFECTION IS PROCRASTINATION</li>
          <li>SHIP TODAY OR SHUT UP</li>
          <li>YOUR COMPETITION ISN'T WAITING</li>
          <li>DECIDE. PRINT. MOVE.</li>
        </ol>
      </section>

      {/* NUMBERS DON'T LIE */}
      <section className="section">
        <h2>REALITY CHECK</h2>
        <div className="grid">
          <div className="card">
            <h3 className="card-title">247</h3>
            <p>PRINTERS READY NOW</p>
          </div>
          <div className="card">
            <h3 className="card-title">4 HRS</h3>
            <p>AVERAGE RESPONSE TIME</p>
          </div>
          <div className="card">
            <h3 className="card-title">$0</h3>
            <p>EXCUSES ACCEPTED</p>
          </div>
        </div>
      </section>

      {/* FINAL PUSH */}
      <section className="section">
        <h2>STOP READING</h2>
        {isAuthenticated ? (
          <div className="binary-choice">
            <Link to="/smart-match" className="btn btn-primary">
              MATCH ME NOW
            </Link>
            <Link to="/dashboard" className="btn">
              CHECK PROGRESS
            </Link>
          </div>
        ) : (
          <div className="binary-choice">
            <Link to="/register" className="btn btn-primary">
              START NOW
            </Link>
            <Link to="/login" className="btn">
              I HAVE ACCOUNT
            </Link>
          </div>
        )}
      </section>

      {/* BRUTAL REMINDER */}
      <section className="section">
        <blockquote>
          "WHILE YOU DELIBERATE, SOMEONE ELSE SHIPS."
        </blockquote>
      </section>
    </div>
  );
};

export default BrutalHome;