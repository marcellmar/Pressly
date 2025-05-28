/**
 * BRUTAL DASHBOARD
 * What matters. Nothing else.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../services/auth/AuthContext';
import { getCurrentUser } from '../services/auth/auth';

const BrutalDashboard = () => {
  const { isAuthenticated } = useAuth();
  const user = getCurrentUser();
  
  if (!isAuthenticated) {
    return (
      <div className="brutal-dashboard">
        <h1>YOU'RE OUT</h1>
        <Link to="/login" className="btn btn-primary">GET IN</Link>
      </div>
    );
  }

  const isProducer = user?.role === 'producer';

  return (
    <div className="brutal-dashboard">
      {/* STATUS: BINARY */}
      <section className="section">
        <h1>{user.fullName || 'USER'}</h1>
        <p className="status status-active">ACTIVE</p>
      </section>

      {/* NUMBERS: TRUTH */}
      <section className="section">
        <h2>YOUR NUMBERS</h2>
        <div className="grid">
          <div className="card">
            <h3 className="card-title">12</h3>
            <p>ACTIVE ORDERS</p>
          </div>
          <div className="card">
            <h3 className="card-title">3</h3>
            <p>NEED DECISION</p>
          </div>
          <div className="card">
            <h3 className="card-title">72HR</h3>
            <p>UNTIL DEADLINE</p>
          </div>
        </div>
      </section>

      {/* ACTIONS: DECIDE NOW */}
      <section className="section">
        <h2>ACT NOW</h2>
        <div className="grid">
          {isProducer ? (
            <>
              <Link to="/job-queue" className="btn btn-primary">
                VIEW JOBS
              </Link>
              <Link to="/capacity" className="btn">
                CHECK CAPACITY
              </Link>
              <Link to="/messages" className="btn">
                MESSAGES (3)
              </Link>
              <Link to="/find-creators" className="btn btn-danger">
                FIND WORK
              </Link>
            </>
          ) : (
            <>
              <Link to="/create" className="btn btn-primary">
                NEW PROJECT
              </Link>
              <Link to="/smart-match" className="btn">
                FIND PRINTER
              </Link>
              <Link to="/orders" className="btn">
                CHECK ORDERS
              </Link>
              <Link to="/messages" className="btn btn-danger">
                URGENT (2)
              </Link>
            </>
          )}
        </div>
      </section>

      {/* PENDING: DECIDE OR DELETE */}
      <section className="section">
        <h2>PENDING DECISIONS</h2>
        <div className="card">
          <h3 className="card-title">ORDER #2847</h3>
          <p>QUOTE RECEIVED. 48 HOURS TO DECIDE.</p>
          <div className="binary-choice">
            <button className="btn btn-primary">ACCEPT</button>
            <button className="btn btn-danger">REJECT</button>
          </div>
        </div>
      </section>

      {/* DEADLINES: NO MERCY */}
      <section className="section">
        <h2>DEADLINES</h2>
        <table>
          <thead>
            <tr>
              <th>PROJECT</th>
              <th>DUE</th>
              <th>STATUS</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>BUSINESS CARDS</td>
              <td>72 HOURS</td>
              <td><span className="status">IN PROGRESS</span></td>
              <td><Link to="/orders/1" className="btn btn-sm">VIEW</Link></td>
            </tr>
            <tr>
              <td>POSTER DESIGN</td>
              <td>24 HOURS</td>
              <td><span className="status status-danger">NEEDS APPROVAL</span></td>
              <td><Link to="/orders/2" className="btn btn-sm btn-danger">DECIDE</Link></td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* BRUTAL REMINDER */}
      <section className="section">
        <blockquote>
          "EVERY MINUTE YOU WAIT, MONEY WALKS."
        </blockquote>
      </section>
    </div>
  );
};

export default BrutalDashboard;