/**
 * DECIDE
 * Binary choices only. No middle ground.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../services/auth/AuthContext';

const Decide = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="brutal-decide">
      <section className="section">
        <h1>DECIDE NOW</h1>
        <p>EVERY SECOND OF DELAY COSTS MONEY</p>
      </section>

      {/* CORE DECISION */}
      <section className="section">
        <h2>WHAT DO YOU NEED?</h2>
        <div className="binary-choice">
          <Link to="/smart-match" className="btn btn-primary">
            FIND A PRINTER
          </Link>
          <Link to="/create" className="btn">
            START A PROJECT
          </Link>
        </div>
      </section>

      {/* TIME DECISION */}
      <section className="section">
        <h2>WHEN?</h2>
        <div className="binary-choice">
          <Link to="/producers?urgent=true" className="btn btn-danger">
            NOW (RUSH)
          </Link>
          <Link to="/producers" className="btn">
            STANDARD
          </Link>
        </div>
      </section>

      {/* BUDGET DECISION */}
      <section className="section">
        <h2>BUDGET?</h2>
        <div className="binary-choice">
          <Link to="/smart-match?budget=premium" className="btn">
            QUALITY FIRST
          </Link>
          <Link to="/smart-match?budget=value" className="btn">
            PRICE FIRST
          </Link>
        </div>
      </section>

      {/* COMMITMENT DECISION */}
      {!isAuthenticated && (
        <section className="section">
          <h2>READY TO COMMIT?</h2>
          <div className="binary-choice">
            <Link to="/register" className="btn btn-primary">
              YES - START NOW
            </Link>
            <Link to="/" className="btn btn-danger">
              NO - I'M OUT
            </Link>
          </div>
        </section>
      )}

      {/* HARSH TRUTH */}
      <section className="section">
        <blockquote>
          "INDECISION IS A DECISION TO FAIL"
        </blockquote>
        
        <h3>FACTS:</h3>
        <ol>
          <li>247 PRINTERS WAITING FOR YOUR JOB</li>
          <li>YOUR COMPETITION SHIPPED 3 PROJECTS TODAY</li>
          <li>PERFECT IS THE ENEMY OF DONE</li>
          <li>EVERY DAY COSTS 2.7% MORE</li>
          <li>DECIDE OR DECAY</li>
        </ol>
      </section>

      {/* FINAL PUSH */}
      <section className="section">
        <h2>LAST CHANCE</h2>
        <div className="binary-choice">
          <Link to="/smart-match" className="btn btn-primary">
            ACT NOW
          </Link>
          <Link to="/" className="btn btn-danger">
            QUIT
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Decide;