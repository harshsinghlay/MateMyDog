import { supabase } from "../supabase";
import type { User } from "@supabase/supabase-js";

export class AuthService {
  async createAccount({
    email,
    password,
    fullName
  }: {
    email: string;
    password: string;
    fullName : string;
  }) {
    try {
      // Try signing in first to check if the user exists
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!signInError) {
        throw new Error("User already exists. Please log in instead.");
      }

      // If sign-in fails, proceed with signup
      const { data, error } = await supabase.auth.signUp(
        {
          email,
          password,
          options: {
              data: {
                fullName : fullName,
              }
          },
        }
      );

      // **Fix: Prioritize errors over success messages**
      if (error) {
        throw error; // This ensures the error is handled before returning any response
      }

      return data; // Only return data if there's no error
    } catch (error) {
      console.error("AuthService :: createAccount :: error", error);
      throw error; // This ensures the caller (AuthContext) correctly receives and handles the error
    }
  }

  async login({ email, password }: { email: string; password: string }) {
    // eslint-disable-next-line no-useless-catch
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      return user;
    } catch (error) {
      console.error("Auth service :: getCurrentUser :: error", error);
      return null;
    }
  }

  async logout() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error("Auth service :: logout :: error", error);
    }
  }

  async resetPassword(email: string) {
    try {
      // Step 1: Check if user exists
      const { data, error } = await supabase
        .from("profiles") // Assuming you store users in "profiles"
        .select("id")
        .eq("email", email)
        .single();

      if (error || !data) {
        throw new Error("No account found with this email.");
      }

      // Step 2: Proceed with password reset if user exists
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo: `${window.location.origin}/update-password`,
        }
      );

      if (resetError) throw resetError;

      return { success: true, message: "Password reset email sent." };
    } catch (error) {
      console.error("Auth service :: resetPassword :: error", error);
      throw error;
    }
  }

  async updatePassword(password: string) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;

      return { success: true, message: "Password updated successfully." };
    } catch (error) {
      console.error("Auth service :: updatePassword :: error", error);
      throw error;
    }
  }

  async deleteUser(userId: string) {
    try {
      // Start a transaction
      const { error: petError } = await supabase
        .from("pets")
        .delete()
        .eq("owner_id", userId);
      if (petError) throw petError;

      const { error: postLikesError } = await supabase
        .from("post_likes")
        .delete()
        .eq("user_id", userId);
      if (postLikesError) throw postLikesError;

      const { error: postCommentsError } = await supabase
        .from("post_comments")
        .delete()
        .eq("user_id", userId);
      if (postCommentsError) throw postCommentsError;

      const { error: socialPostsError } = await supabase
        .from("social_posts")
        .delete()
        .eq("user_id", userId);
      if (socialPostsError) throw socialPostsError;

      const { error: profileError } = await supabase
        .from("profiles")
        .delete()
        .eq("id", userId);
      if (profileError) throw profileError;

      // Finally, delete the user from auth
      const { error: authError } = await supabase.auth.admin.deleteUser(userId);
      if (authError) throw authError;

      return {
        success: true,
        message: "User and related data deleted successfully",
      };
    } catch (error) {
      console.error("Auth service :: deleteUser :: error", error);
      throw error;
    }
  }
}

export const authService = new AuthService();
