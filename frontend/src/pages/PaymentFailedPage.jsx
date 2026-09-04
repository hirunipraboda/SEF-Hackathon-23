import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { bookingService } from '../services/bookingService';
import { AlertTriangle, RefreshCw, ArrowLeft, ShieldAlert, CreditCard } from 'lucide-react';

const PaymentFailedPage = () => {
  const { bookingId } = useParams();
  const [searchParams] = useSearchParams();
  const reason = searchParams.get('reason') || 'Transaction was declined by the simulated card issuer.';

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookingService
      .getBooking(bookingId)
      .then((data) => setBooking(data))
      .catch((err) => console.error('Error fetching booking on fail page', err))
      .finally(() => setLoading(false));
  }, [bookingId]);

  return (
    <div className="bg-[#F8FAFC] py-12 min-h-screen">
      <div className="max-w-lg mx-auto px-4 sm:px-6 space-y-6">
        {/* Failed Banner Card */}
        <div className="bg-white rounded-2xl border border-red-200 p-8 shadow-sm text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto shadow-sm ring-8 ring-red-50">
            <AlertTriangle className="w-9 h-9" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-red-700 bg-red-50 px-3 py-1 rounded-full border border-red-200 inline-block mb-2">
              Payment Processing Declined
            </span>
            <h1 className="text-2xl font-black text-gray-900">Payment Could Not Be Completed</h1>
            <p className="text-xs text-gray-600 mt-1 leading-relaxed">
              {reason}
            </p>
          </div>

          {/* Booking Status Card */}
          <div className="bg-slate-50 border border-gray-200 rounded-xl p-4 text-left text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Booking Reference:</span>
              <span className="font-mono font-bold text-gray-900">
                {booking?.bookingReference || 'TL-PENDING'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Booking State:</span>
              <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-[11px]">
                Payment Pending
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Amount Due:</span>
              <span className="font-bold text-gray-900">
                Rs. {Number(booking?.totalAmount || 0).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Guarantee Note */}
          <div className="text-[11px] text-gray-500 text-left bg-blue-50/50 p-3 rounded-lg border border-blue-100 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <span>
              Your reserved booking has not been cancelled or duplicated. You can safely retry payment using the success test card (<code className="font-mono font-bold text-blue-900">•••• 4242</code>).
            </span>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <Link
              to={`/payment/${bookingId}`}
              className="w-full sm:flex-1 bg-[#0B1A2C] hover:bg-slate-900 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Try Payment Again</span>
            </Link>

            <Link
              to="/my-bookings"
              className="w-full sm:w-auto bg-white hover:bg-slate-100 text-gray-700 font-bold py-2.5 px-4 rounded-xl text-xs border border-gray-200 transition-colors"
            >
              View in My Bookings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailedPage;
