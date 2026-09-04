import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { TrainTrackLogo } from '../components/TrainTrackLogo';
import { User } from 'lucide-react';

const Navbar = () => {
  const navLinkClass = ({ isActive }) =>
    `px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors ${
      isActive
        ? 'bg-[#0B1A2C] text-white shadow-sm'
        : 'text-gray-700 hover:text-black hover:bg-gray-100'
    }`;

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center">
            <TrainTrackLogo />
          </Link>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            <NavLink to="/" end className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/live-tracking" className={navLinkClass}>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Live Tracking
              </span>
            </NavLink>
            <NavLink to="/routes" className={navLinkClass}>
              Routes & Schedules
            </NavLink>
            <NavLink to="/fare-calculator" className={navLinkClass}>
              Fare Calculator
            </NavLink>
            <NavLink to="/report-issue" className={navLinkClass}>
              Report Issue
            </NavLink>
            <NavLink to="/feedback" className={navLinkClass}>
              Feedback
            </NavLink>
            <NavLink to="/my-bookings" className={navLinkClass}>
              My Bookings
            </NavLink>
          </nav>

          {/* Right Status Badges & Quick Action */}
          <div className="flex items-center gap-2.5">
            <div className="hidden sm:flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs px-2.5 py-1 rounded-full font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>24 Services Active</span>
            </div>

            <NavLink
              to="/my-bookings"
              className={({ isActive }) =>
                `hidden sm:flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-semibold border transition-colors ${
                  isActive
                    ? 'bg-[#0B1A2C] text-white border-[#0B1A2C]'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                }`
              }
            >
              <span>Tickets</span>
            </NavLink>

            <NavLink
              to="/my-reports"
              className={({ isActive }) =>
                `flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-semibold border transition-colors ${
                  isActive
                    ? 'bg-[#0B1A2C] text-white border-[#0B1A2C]'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                }`
              }
            >
              <span>My Reports</span>
              <span className="w-4 h-4 rounded-full bg-slate-900 text-white text-[10px] flex items-center justify-center font-bold">
                2
              </span>
            </NavLink>

            <button
              className="w-8 h-8 rounded-full bg-[#0B1A2C] text-white flex items-center justify-center hover:bg-slate-800 transition-colors"
              title="Passenger Profile"
              aria-label="Passenger Profile"
            >
              <User className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Strip */}
        <div className="flex lg:hidden overflow-x-auto py-2 border-t border-gray-100 gap-2 no-scrollbar">
          <NavLink to="/" end className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/live-tracking" className={navLinkClass}>
            Live Tracking
          </NavLink>
          <NavLink to="/routes" className={navLinkClass}>
            Routes
          </NavLink>
          <NavLink to="/my-bookings" className={navLinkClass}>
            My Bookings
          </NavLink>
          <NavLink to="/fare-calculator" className={navLinkClass}>
            Fare Calculator
          </NavLink>
          <NavLink to="/report-issue" className={navLinkClass}>
            Report Issue
          </NavLink>
          <NavLink to="/feedback" className={navLinkClass}>
            Feedback
          </NavLink>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
