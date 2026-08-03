import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AppLayout } from '../layouts/AppLayout';
import { LandingPage } from '../pages/LandingPage';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { VoucherListPage } from '../pages/VoucherListPage';
import { VoucherCreatePage } from '../pages/VoucherCreatePage';
import { VoucherEditPage } from '../pages/VoucherEditPage';
import { VoucherDetailPage } from '../pages/VoucherDetailPage';
import { Role } from '../types';

const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: Role[] }> = ({
  children,
  allowedRoles,
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Corporate Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* Public Login & Register Portal */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />

      {/* Protected Dashboard & Voucher Management Routes */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/vouchers" element={<VoucherListPage />} />
        <Route
          path="/vouchers/create"
          element={
            <ProtectedRoute allowedRoles={['EMPLOYEE']}>
              <VoucherCreatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vouchers/:id/edit"
          element={
            <ProtectedRoute allowedRoles={['EMPLOYEE']}>
              <VoucherEditPage />
            </ProtectedRoute>
          }
        />
        <Route path="/vouchers/:id" element={<VoucherDetailPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
