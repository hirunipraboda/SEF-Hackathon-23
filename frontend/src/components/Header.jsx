import React from 'react';
import './Header.css';

export default function Header() {
  return (
    <header className="tt-header">
      <div className="tt-header-inner">
        <div className="tt-logo">
          <span className="tt-logo-icon">🚆</span>
          <div>
            <div className="tt-logo-title">TrainTrack</div>
            <div className="tt-logo-sub">SRI LANKA RAILWAYS</div>
          </div>
        </div>

        <nav className="tt-nav">
          <span className="tt-nav-item">Home</span>
          <span className="tt-nav-item">Routes & Schedules</span>
          <span className="tt-nav-item active">Fare Calculator</span>
          <span className="tt-nav-item">Report Issue</span>
          <span className="tt-nav-item">Feedback</span>
        </nav>

        <div className="tt-header-right">
          <span className="tt-pill tt-pill-green">
            <span className="tt-dot" /> 24 Services Active
          </span>
          <span className="tt-pill">My Reports <span className="tt-badge">2</span></span>
          <div className="tt-avatar">👤</div>
        </div>
      </div>
    </header>
  );
}
