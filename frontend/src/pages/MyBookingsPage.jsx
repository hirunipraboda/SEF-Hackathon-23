import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingService } from '../services/bookingService';
import BookingCard from '../components/booking/BookingCard';
import { Ticket, Search, Filter, RefreshCw, AlertCircle, ArrowRight } from 'lucide-react';

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchBookings = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await bookingService.getBookings();
      setBookings(data);
    } catch (err) {
      console.error('Failed to load bookings', err);
      setError(err.message || 'Could not load your train bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter((b) => {
    const matchesStatus =
      statusFilter === 'ALL' || b.bookingStatus === statusFilter;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      b.bookingReference?.toLowerCase().includes(query) ||
      b.train?.trainName?.toLowerCase().includes(query) ||
      b.originStation?.name?.toLowerCase().includes(query) ||
      b.destinationStation?.name?.toLowerCase().includes(query);

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="bg-[#F8FAFC] py-8 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Header Card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  Passenger Ticket Management
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900">My Train Bookings</h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Review your active reservations, digital tickets, and pending transactions.
              </p>
            </div>

            <Link
              to="/routes"
              className="inline-flex items-center gap-2 bg-[#0B1A2C] hover:bg-slate-900 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-all shrink-0"
            >
              <Ticket className="w-4 h-4" />
              <span>Book New Journey</span>
            </Link>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Status Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {[
              { id: 'ALL', label: 'All Bookings' },
              { id: 'CONFIRMED', label: 'Confirmed' },
              { id: 'PENDING_PAYMENT', label: 'Pending Payment' },
              { id: 'CANCELLED', label: 'Cancelled' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                  statusFilter === tab.id
                    ? 'bg-[#0B1A2C] text-white shadow-sm'
                    : 'text-gray-600 hover:text-black hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box & Refresh */}
          <div className="flex items-center gap-2 w-full md:w-72">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search reference, train, station..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
            </div>

            <button
              onClick={fetchBookings}
              title="Refresh Bookings"
              className="p-2 text-gray-500 hover:text-black hover:bg-gray-100 rounded-lg border border-gray-200"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="py-20 text-center space-y-2">
            <div className="w-8 h-8 border-4 border-[#0B1A2C] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs font-semibold text-gray-500">Loading your passenger bookings...</p>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center justify-between">
            <span>{error}</span>
            <button onClick={fetchBookings} className="font-bold underline ml-2">
              Retry
            </button>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center space-y-4 shadow-sm">
            <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Ticket className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">No Bookings Found</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                {searchQuery || statusFilter !== 'ALL'
                  ? 'No passenger records match your selected filter criteria.'
                  : 'You have not made any train reservations yet. Explore available express lines and book your first journey.'}
              </p>
            </div>
            <Link
              to="/routes"
              className="inline-flex items-center gap-1.5 bg-[#0B1A2C] hover:bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors"
            >
              <span>Explore Train Routes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredBookings.map((booking) => (
              <BookingCard key={booking._id} booking={booking} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookingsPage;
