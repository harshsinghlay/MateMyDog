import React, { useState, useEffect } from "react";
import { X, Mail, User, Eye, EyeOff, Lock } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthMode = "signin" | "signup" | "forgot-password";

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const { signIn, signUp, resetPassword } = useAuth();

  useEffect(() => {
    setError(null);
    setMessage(null);
  }, [mode]);

  if (!isOpen) return null;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

  // const handleResendVerification = async () => {
  //   if (!email || resendingEmail) return;
    
  //   try {
  //     const result = await authService.resendVerificationEmail(email);
  //     toast.success(result.message);
  //   } catch (err) {
  //     toast.error("Internal Server Error");
  //   } finally {
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (mode === "signup") {
      if (!fullName.trim() || fullName.length > 30) {
        setError("Full Name must be between 1 and 30 characters.");
        return;
      }
      if (!passwordRegex.test(password)) {
        setError(
          "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character."
        );
        return;
      }
    }

    setLoading(true);
    try {
      if (mode === "signin") {
        await signIn(email, password);
        onClose();
        navigate("/");
      } else if (mode === "signup") {
        await signUp(email, password, fullName);
        setMessage("Please check your email to confirm your account.");
      } else if (mode === "forgot-password") {
        await resetPassword(email);
        setMessage("Password reset instructions have been sent to your email.");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred.";
      setError(errorMessage);
      
      // Show resend button if email not confirmed
      if (errorMessage.includes("Email not confirmed")) {
        setError("Email not confirmed. Please verify your email or click below to resend verification email.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-serif">
            {mode === "signin"
              ? "Welcome Back"
              : mode === "signup"
              ? "Create Account"
              : "Reset Password"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === "signup" && (
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="pl-10 w-full h-12 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="pl-10 w-full h-12 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          {mode !== "forgot-password" && (
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
                  <Lock size={20} />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="pl-10 pr-12 w-full h-12 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}
          {message && <p className="text-sm text-green-600">{message}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading
              ? "Loading..."
              : mode === "signin"
              ? "Sign In"
              : mode === "signup"
              ? "Sign Up"
              : "Reset Password"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          {mode === "signin" ? (
            <>
              <button
                onClick={() => setMode("forgot-password")}
                className="text-indigo-600 hover:text-indigo-500"
              >
                Forgot password?
              </button>
              <p className="mt-2">
                Don't have an account?{" "}
                <button
                  onClick={() => setMode("signup")}
                  className="text-indigo-600 hover:text-indigo-500"
                >
                  Sign up
                </button>
              </p>
            </>
          ) : (
            <p>
              Remember your password?{" "}
              <button
                onClick={() => setMode("signin")}
                className="text-indigo-600 hover:text-indigo-500"
              >
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
