import React, { useState } from 'react';
import { CreditCard, Lock, AlertCircle, ShieldAlert, CheckCircle2, Sparkles, Loader2 } from 'lucide-react';

const PaymentForm = ({ totalAmount, onSubmit, loading, error }) => {
  const [cardholderName, setCardholderName] = useState('John Doe');
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [expiry, setExpiry] = useState('12/30');
  const [cvv, setCvv] = useState('123');

  const handleApplyPreset = (type) => {
    if (type === 'SUCCESS') {
      setCardNumber('4242 4242 4242 4242');
      setCardholderName('Kasun Perera');
    } else {
      setCardNumber('4000 0000 0000 0002');
      setCardholderName('Simulated Decline');
    }
  };

  const handleCardNumberChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = val.match(/.{1,4}/g)?.join(' ') || val;
    setCardNumber(formatted);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loading) return;
    onSubmit({
      cardholderName,
      demoCardNumber: cardNumber,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-5">
      {/* Demo Disclaimer Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 leading-relaxed">
          <strong className="font-bold block text-amber-950 mb-0.5">
            Safe Sandbox Demo Mode Active
          </strong>
          This is an educational sandbox portal. <strong>No real money will be charged</strong> and no real card numbers or credentials are ever stored. Use the pre-filled demo cards below.
        </div>
      </div>

      {/* Preset Quick Fill Buttons */}
      <div>
        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
          Demo Test Scenarios
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleApplyPreset('SUCCESS')}
            className={`text-left p-2.5 rounded-lg border text-xs transition-all flex items-center justify-between ${
              cardNumber.endsWith('4242')
                ? 'border-emerald-500 bg-emerald-50/50 text-emerald-900 font-semibold'
                : 'border-gray-200 hover:border-gray-300 text-gray-700 bg-white'
            }`}
          >
            <div>
              <span className="block font-bold">Simulate Success Card</span>
              <span className="font-mono text-[11px] text-gray-500">•••• 4242</span>
            </div>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </button>

          <button
            type="button"
            onClick={() => handleApplyPreset('FAILURE')}
            className={`text-left p-2.5 rounded-lg border text-xs transition-all flex items-center justify-between ${
              cardNumber.endsWith('0002')
                ? 'border-red-500 bg-red-50/50 text-red-900 font-semibold'
                : 'border-gray-200 hover:border-gray-300 text-gray-700 bg-white'
            }`}
          >
            <div>
              <span className="block font-bold">Simulate Decline Card</span>
              <span className="font-mono text-[11px] text-gray-500">•••• 0002</span>
            </div>
            <AlertCircle className="w-4 h-4 text-red-600" />
          </button>
        </div>
      </div>

      {/* Card Inputs */}
      <div className="space-y-4 pt-2 border-t border-gray-100">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Cardholder Name
          </label>
          <input
            type="text"
            required
            value={cardholderName}
            onChange={(e) => setCardholderName(e.target.value)}
            placeholder="John Doe"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Card Number (Demo)
          </label>
          <div className="relative">
            <input
              type="text"
              required
              value={cardNumber}
              onChange={handleCardNumberChange}
              placeholder="4242 4242 4242 4242"
              className="w-full pl-10 pr-3 py-2 text-sm font-mono border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <CreditCard className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Expiry Date
            </label>
            <input
              type="text"
              required
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              placeholder="MM/YY"
              maxLength={5}
              className="w-full px-3 py-2 text-sm font-mono border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              CVV (Security Code)
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                placeholder="•••"
                maxLength={4}
                className="w-full pl-9 pr-3 py-2 text-sm font-mono border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <Lock className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Pay Action Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#0B1A2C] hover:bg-slate-900 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Processing Demo Payment...</span>
          </>
        ) : (
          <>
            <Lock className="w-4 h-4 text-emerald-400" />
            <span>Pay Rs. {Number(totalAmount || 0).toLocaleString()} (Demo)</span>
          </>
        )}
      </button>

      <div className="text-center text-[11px] text-gray-400 flex items-center justify-center gap-1.5">
        <Lock className="w-3 h-3" />
        <span>256-Bit Encrypted Simulated SSL Session • TrainTrack Rail Transit</span>
      </div>
    </form>
  );
};

export default PaymentForm;
