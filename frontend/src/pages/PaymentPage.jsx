import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { bookingService } from '../services/bookingService';
import { paymentService } from '../services/paymentService';
import PaymentSummary from '../components/payment/PaymentSummary';
import PaymentForm from '../components/payment/PaymentForm';
import { ShieldCheck, ArrowLeft, Lock, Train, AlertCircle } from 'lucide-react';

const PaymentPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [errorNotice, setErrorNotice] = useState('');

  useEffect(() => {
    const loadBooking = async () => {
      setLoading(true);
      setErrorNotice('');
      try {
        const data = await bookingService.getBooking(bookingId);
        if (!data) {
          setErrorNotice('Booking not found.');
          return;
        }

        // If already paid, jump straight to success confirmation
        if (data.bookingStatus === 'CONFIRMED' && data.paymentStatus === 'PAID') {
          navigate(`/payment/success/${data._id}`, { replace: true });
          return;
        }

        setBooking(data);
      } catch (err) {
        console.error('Failed to load booking for payment', err);
        setErrorNotice(err.message || 'Could not load booking details.');
      } finally {
        setLoading(false);
      }
    };

    loadBooking();
  }, [bookingId, navigate]);

  const handlePaymentSubmit = async ({ cardholderName, demoCardNumber }) => {
    setProcessing(true);
    setErrorNotice('');

    try {
      const result = await paymentService.createPayment({
        bookingId: booking._id,
        cardholderName,
        demoCardNumber,
      });

      // If backend confirms payment
      navigate(`/payment/success/${booking._id}`);
    } catch (err) {
      console.error('Payment failure encountered', err);
      // Navigate to failure page
      navigate(`/payment/failed/${booking._id}?reason=${encodeURIComponent(err.message || 'Transaction Declined')}`);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-4 border-[#0B1A2C] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-semibold text-gray-500">Securing Payment Channel...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Booking Not Found</h2>
        <p className="text-xs text-gray-500">{errorNotice || 'The requested booking could not be located in the database.'}</p>
        <Link
          to="/routes"
          className="inline-block bg-[#0B1A2C] text-white text-xs font-bold px-4 py-2 rounded-lg"
        >
          Return to Schedules
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#F8FAFC] py-8 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Link to={`/booking/${booking.schedule?._id || ''}`} className="hover:text-black flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" />
            <span>Back to Journey Selection</span>
          </Link>
          <span>/</span>
          <span className="font-bold text-gray-800">Secure Payment</span>
        </div>

        {/* Header */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#0B1A2C] text-white flex items-center justify-center font-bold">
              <Lock className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-gray-900">Secure Payment Portal</h1>
                <span className="text-xs bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded border border-emerald-200">
                  Demo Sandbox Active
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Complete your transaction to issue ticket reference: <strong className="font-mono text-gray-800">{booking.bookingReference}</strong>
              </p>
            </div>
          </div>
        </div>

        {/* 2-Column Checkout Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {/* Payment Form (Left 2 cols) */}
          <div className="md:col-span-2 space-y-4">
            <PaymentForm
              totalAmount={booking.totalAmount}
              onSubmit={handlePaymentSubmit}
              loading={processing}
              error={errorNotice}
            />
          </div>

          {/* Booking Summary Sidebar (Right 1 col) */}
          <div className="space-y-4">
            <PaymentSummary booking={booking} />

            <div className="bg-white rounded-xl border border-gray-200 p-4 text-xs text-gray-500 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-gray-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Simulated Guarantee</span>
              </div>
              <p className="leading-relaxed text-[11px]">
                Transactions processed in this environment are authenticated against simulated railway clearing accounts. Instant ticket confirmation will be generated upon approval.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
