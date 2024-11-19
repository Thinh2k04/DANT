import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import { publicRoutes, privateRoutes } from './routers/index';
import LoginPage from './pages/login/page'; // Đảm bảo đã import LoginPage
import handleLogin from './utils/auth'

function App() {
  const navigate = useNavigate();

  return (
    <div className="w-full h-screen">
      <div className="w-full h-full">
        <Routes>
          {/* Route cho trang đăng nhập */}
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />

          {/* Public routes */}
          {Array.isArray(publicRoutes) &&
            publicRoutes.map((route, index) => {
              const Page = route.component;
              return <Route key={index} path={route.path} element={<Page />} />;
            })}

          {/* Private routes */}
          {
            privateRoutes.map((route, index) => {
              const Page = route.component;
              return <Route key={index} path={route.path} element={<Page />} />;
            })}

        </Routes>
      </div>
    </div>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
