import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Toast from './components/Toast';

// Pages
import Dashboard from './pages/Dashboard';
import Timetable from './pages/Timetable';
import Attendance from './pages/Attendance';
import BunkCalculatorPage from './pages/BunkCalculatorPage';
import Subjects from './pages/Subjects';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col antialiased selection:bg-primary/20 selection:text-primary">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col flex-1 min-w-0 transition-all duration-300">
        {/* Top Navbar */}
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        {/* Dynamic Route View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/timetable" element={<Timetable />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/calculator" element={<BunkCalculatorPage />} />
            <Route path="/subjects" element={<Subjects />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      {/* Persistent Floating Toasts */}
      <Toast />
    </div>
  );
}

