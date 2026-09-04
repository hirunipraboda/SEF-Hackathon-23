import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import ReportIssuePage from './pages/ReportIssuePage';
import MyReportsPage from './pages/MyReportsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<ReportIssuePage />} />
          <Route path="report-issue" element={<ReportIssuePage />} />
          <Route path="my-reports" element={<MyReportsPage />} />
          <Route path="*" element={<Navigate to="/report-issue" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
