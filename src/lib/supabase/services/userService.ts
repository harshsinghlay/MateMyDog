import { supabase } from "../../supabase";
import {User} from '../../../types/user';


class UserService {
  async getUserInfo(userId: string): Promise<User> {
    try {
      const { data, error } = await supabase
        .from("profiles") // Ensure it matches `updateUserInfo`
        .select("id, fullName, email, avatar_url, location, is_active") // Select only necessary fields
        .eq("id", userId) // Use `id` instead of `user_id`
        .single();

      if (error) throw error;

      return {
            id : data.id,
            fullName: data.fullName,
            email: data.email,
            avatarUrl: data.avatar_url,
            location: data.location,
            isActive : data.is_active,
          }
    } catch (error) {
      console.error("Error getting user info:", error);
      throw error;
    }
  }

  async updateUserInfo(userId: string, info: User): Promise<void> {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .upsert(
          {
            id: userId, // Ensure ID is included
            fullName: info.fullName,
            email: info.email,
            avatar_url: info.avatarUrl,
            location: info.location,
            is_active : info.isActive,
          },
        )
        .select()
        .single();

      if (data) {
        return data;
      }

      if (error) throw error;

  
    } catch (error) {
      console.error("Error updating user info:", error);
      throw error;
    }
  }

  async updateUserActiveStatus(userId: string, isActive: boolean):    Promise<void> {
    try {
      // First update all pets of this user
      const { error: petsError } = await supabase
        .from('pets')
        .update({  is_active : isActive })
        .eq('owner_id', userId);

      if (petsError) throw new Error('Failed to update pets status');

      // Then update user profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ is_active : isActive })
        .eq('id', userId);

      if (profileError) throw new Error('Failed to update user status');

    } catch (error) {
      console.error("Error updating active status:", error);
      throw error;
    }
  }

}

export const userService = new UserService();
