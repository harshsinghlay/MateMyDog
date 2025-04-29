import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "../types/user.ts";
import { authService } from "../lib/supabase/auth.ts";
import { toast } from "react-hot-toast";
import { userService } from "../lib/supabase/services/userService.ts";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setIsAuthenticated: (value: boolean) => void;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  
   

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
          setIsAuthenticated(true);
          const userInfo = await userService.getUserInfo(currentUser.id);
          setUser({ ...currentUser, ...userInfo });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    setIsLoading(true);
    try {
      const data = await authService.createAccount({
        email,
        password,
        fullName,
      });
      if (data?.user) {
        toast.success("Please check your email to verify your account");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error signing up:", error);
      toast.error("Signup failed. Please try again.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const data = await authService.login({ email, password });
      if (!data.user) throw new Error("No user data returned");
      if (!data.user.email_confirmed_at) {
        await authService.logout();
        throw new Error("Please verify your email before signing in");
      }
      const userInfo = await userService.getUserInfo(data.user.id);
      setUser({ ...data.user, ...userInfo });
      setIsAuthenticated(true);
      toast.success("Welcome back! You are now signed in");
    } catch (error) {
      console.error("Error signing in:", error);
      toast.error("Signin failed. Please try again.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
      toast.success("Signed out successfully");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Signout failed");
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setIsLoading(true);
    try {
      const result = await authService.resetPassword(email);
      if (result?.success) {
        toast.success(result.message);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error resetting password:", error);
      toast.error("Failed to reset password.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        setUser,
        setIsAuthenticated,
        signUp,
        signIn,
        signOut,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
