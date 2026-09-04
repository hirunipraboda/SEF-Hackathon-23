import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { TrainTrackLogo } from '../components/TrainTrackLogo';
import { User, AlertCircle, ShieldAlert } from 'lucide-react';
import { issueService } from '../services/issueService';

const Navbar = () => {
  const [reportCount, setReportCount] = useState(0);

  useEffect(() => {
    issueService.getAllIssues()
      .then((data) => setReportCount(data.length))
      .catch(() => setReportCount(0));
  }, []);

  const navLinkClass = ({ isActive }) =>
    `px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors ${
      isActive
        ? 'bg-[#0B1A2C] text-white shadow-sm font-bold'
        : 'text-gray-700 hover:text-black hover:bg-gray-100'
    }`;

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/report-issue" className="flex items-center">
            <TrainTrackLogo />
          </Link>

          {/* Navigation Links */}
          <nav className="hidden sm:flex items-center space-x-2">
            <NavLink to="/report-issue" className={navLinkClass}>
              Report an Issue
            </NavLink>
            <NavLink to="/my-reports" className={navLinkClass}>
              My Reports
            </NavLink>
          </nav>

          {/* Right Status Badges & Quick Action */}
          <div className="flex items-center gap-2.5">
            <div className="hidden md:flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs px-2.5 py-1 rounded-full font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Civic Depot Dispatch Active</span>
            </div>

            <NavLink
              to="/my-reports"
              className={({ isActive }) =>
                `flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-semibold border transition-colors ${
                  isActive
                    ? 'bg-[#0B1A2C] text-white border-[#0B1A2C]'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                }`
              }
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Track Reports</span>
              {reportCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-slate-900 text-white text-[10px] flex items-center justify-center font-bold">
                  {reportCount}
                </span>
              )}
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
        <div className="flex sm:hidden overflow-x-auto py-2 border-t border-gray-100 gap-2">
          <NavLink to="/report-issue" className={navLinkClass}>
            Report an Issue
          </NavLink>
          <NavLink to="/my-reports" className={navLinkClass}>
            My Reports
          </NavLink>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
