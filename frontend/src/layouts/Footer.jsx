import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#081524] text-slate-400 text-xs mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Brand & Status */}
          <div className="space-y-4">
            <h3 className="text-white font-extrabold text-base tracking-tight">TrainTrack</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              The official commuter intelligence and real-time operations portal for Sri Lanka Railways
              network passengers, intercity travelers, and transit authorities.
            </p>
            <div className="inline-flex items-center gap-2 bg-[#0d2138] border border-slate-700/80 rounded-md px-3 py-1.5 text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Network Operating Normally</span>
            </div>
          </div>

          {/* Column 2: Railway Lines Overview */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              Railway Lines Overview
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-slate-200 cursor-pointer">Main Line (Colombo Fort – Badulla)</li>
              <li className="hover:text-slate-200 cursor-pointer">Coastal Line (Colombo Fort – Beliatta)</li>
              <li className="hover:text-slate-200 cursor-pointer">Northern Line (Polgahawela – Kankesanthurai)</li>
              <li className="hover:text-slate-200 cursor-pointer">Kelani Valley Line (Colombo – Avissawella)</li>
              <li className="hover:text-slate-200 cursor-pointer">Batticaloa & Trincomalee Lines</li>
              <li className="hover:text-slate-200 cursor-pointer">Puttalam Line</li>
            </ul>
          </div>

          {/* Column 3: Quick Navigation */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/routes" className="hover:text-slate-200">Live Seat Availability</Link></li>
              <li><Link to="/routes" className="hover:text-slate-200">Intercity Express Schedules</Link></li>
              <li><Link to="/routes" className="hover:text-slate-200">Platform Departure Displays</Link></li>
              <li><Link to="/fare-calculator" className="hover:text-slate-200">Seasonal Season Tickets</Link></li>
              <li><Link to="/fare-calculator" className="hover:text-slate-200">Railway Gazette & Regulations</Link></li>
              <li><Link to="/report-issue" className="hover:text-slate-200">Lost & Found Depot</Link></li>
            </ul>
          </div>

          {/* Column 4: Passenger Helpline */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              Passenger Helpline
            </h4>
            <div className="bg-[#0e2136] p-4 rounded-lg border border-slate-700/80 space-y-2">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                Sri Lanka Railways Hotline
              </span>
              <div className="text-2xl font-black text-white tracking-tight">1971</div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Toll-free 24/7 dedicated transit emergency & info assistance
              </p>
              <div className="pt-2 border-t border-slate-700/60 text-[11px] text-slate-300">
                <span className="block text-slate-400 text-[10px]">Central Train Control Office:</span>
                Colombo Fort Operations: <span className="font-semibold text-white">+94 11 2434215</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal bar */}
        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-[11px] text-slate-500 gap-4">
          <p>
            © 2026 Sri Lanka Railways & TrainTrack System. All rights reserved. Designed & engineered as an open civic software initiative by University IT Undergraduates.
          </p>
          <div className="flex items-center space-x-4 shrink-0">
            <span className="hover:text-slate-400 cursor-pointer">Terms of Carriage</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Transit API</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
