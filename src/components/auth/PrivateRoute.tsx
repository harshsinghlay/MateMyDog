import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { AuthModal } from "./AuthModal";

interface PrivateRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export function PrivateRoute({
  children,
  requireAuth = false,
}: PrivateRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const [showAuthModal, setShowAuthModal] = React.useState(false);
  const location = useLocation();

  // Only show loading state if authentication is required
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // If authentication is required and user is not authenticated, redirect to home
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // For non-required auth routes, show the content but with auth modal when needed
  return (
    <>
      {children}
      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      )}
    </>
  );
}
