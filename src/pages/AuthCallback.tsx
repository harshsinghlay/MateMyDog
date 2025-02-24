import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

export function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the URL hash
        const hash = window.location.hash;
        const accessToken = new URLSearchParams(hash.substring(1)).get('access_token');
        
        if (accessToken) {
          // Set the session using the access token
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: new URLSearchParams(hash.substring(1)).get('refresh_token') || '',
          });

          if (error) throw error;
          
          toast.success('Email confirmed successfully! You are now signed in.');
        } else {
          // If no access token, try to get the current session
          const { error } = await supabase.auth.getSession();
          if (error) throw error;
        }

        // Redirect to home page
        navigate('/');
      } catch (error) {
        console.error('Error in auth callback:', error);
        toast.error('Authentication failed. Please try again.');
        navigate('/');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Confirming your email...</p>
      </div>
    </div>
  );
}