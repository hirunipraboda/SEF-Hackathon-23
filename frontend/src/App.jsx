import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import RoutesPage from './pages/RoutesPage';
import RouteDetailPage from './pages/RouteDetailPage';
import FareCalculatorPage from './pages/FareCalculatorPage';
import ReportIssuePage from './pages/ReportIssuePage';
import MyReportsPage from './pages/MyReportsPage';
import FeedbackPage from './pages/FeedbackPage';
import LiveTrackingPage from './pages/LiveTrackingPage';
import BookingPage from './pages/BookingPage';
import PaymentPage from './pages/PaymentPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentFailedPage from './pages/PaymentFailedPage';
import MyBookingsPage from './pages/MyBookingsPage';
import BookingDetailPage from './pages/BookingDetailPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="live-tracking" element={<LiveTrackingPage />} />
          <Route path="routes" element={<RoutesPage />} />
          <Route path="routes/:id" element={<RouteDetailPage />} />
          <Route path="booking" element={<BookingPage />} />
          <Route path="booking/:scheduleId" element={<BookingPage />} />
          <Route path="payment/:bookingId" element={<PaymentPage />} />
          <Route path="payment/success/:bookingId" element={<PaymentSuccessPage />} />
          <Route path="payment/failed/:bookingId" element={<PaymentFailedPage />} />
          <Route path="my-bookings" element={<MyBookingsPage />} />
          <Route path="my-bookings/:bookingId" element={<BookingDetailPage />} />
          <Route path="fare-calculator" element={<FareCalculatorPage />} />
          <Route path="report-issue" element={<ReportIssuePage />} />
          <Route path="my-reports" element={<MyReportsPage />} />
          <Route path="feedback" element={<FeedbackPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
