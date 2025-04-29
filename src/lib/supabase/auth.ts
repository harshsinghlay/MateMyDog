import { supabase } from "../supabase";
import type { User } from "@supabase/supabase-js";

export class AuthService {

  async createAccount({
    email,
    password,
    fullName,
  }: {
    email: string;
    password: string;
    fullName: string;
  }) {
    try {
      // Check if the user already exists
      const { data: existingUser, error: fetchError } = await supabase
        .from("profiles") // Supabase stores users in the auth.users system table
        .select("id")
        .eq("email", email)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        // PGRST116 means no matching record found, so it's safe to proceed
        console.log("Error checking existing user: " + fetchError.message);
      }

      if (existingUser) {
        throw new Error("User already exists. Please log in instead.");
      }

      // Proceed with signup
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            fullName,
          },
        },
      });


      if (authError) throw new Error("Signup failed! Please try again.");

      // Ensure user data exists and has an ID
      if (!authData.user?.id) throw new Error("UserId is missing after signup");

      const userId = authData.user.id;

      // Insert an empty entry into the addresses table
      const { data: addressData, error: addressError } = await supabase.from("addresses").insert([
        {
          user_id: userId,
          postal_code: "",
          state: "",
          city: "",
          country: "",
          lat: "",
          lng: "",
        },
      ]).select("id") // Only select the id we need
        .single();

      if (addressError) {
        console.error("Address creation failed:", addressError.message);
        throw new Error("Failed to add address");
      }

      // 4. Create profile with address reference
      const { error: profileError } = await supabase
        .from("profiles")
        .insert({
          id: userId,
          email: email,
          full_name: fullName,
          location: addressData.id, // Reference to the address
        });

      if (profileError) {
        console.error("Profile creation failed:", profileError.message);

        // Attempt to clean up the address if profile creation failed
        await supabase
          .from("addresses")
          .delete()
          .eq("id", addressData.id);

        throw new Error("Failed to create user profile");
      }


      return authData; // Only return data if there's no error
    } catch (error) {
      console.error("AuthService :: createAccount :: error", error);
      throw error; // Ensures the caller correctly receives and handles the error
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

  async resendVerificationEmail(email: string) {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) throw error;

      return { success: true, message: "Verification email resent successfully." };
    } catch (error) {
      console.error("Auth service :: resendVerificationEmail :: error", error);
      throw error;
    }
  }


}

export const authService = new AuthService();
