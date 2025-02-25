import { supabase } from "../../supabase";
import {User} from '../../../types/user';


class UserService {
  async getUserInfo(userId: string): Promise<User> {
    try {
      const { data, error } = await supabase
        .from("profiles") // Ensure it matches `updateUserInfo`
        .select("id, fullName, email, avatar_url, address") // Select only necessary fields
        .eq("id", userId) // Use `id` instead of `user_id`
        .single();

      if (error) throw error;

      return {
            id : data.id,
            fullName: data.fullName,
            email: data.email,
            avatarUrl: data.avatar_url,
            address: data.address,
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
            address: info.address,
          },
        //   { onConflict: ["id"] } // Use ID for conflict resolution
        )
        .select()
        .single();

      if (data) {
        return data;
      }

      if (error) throw error;

    //   // Optionally update the auth metadata
    //   const { error: updateError } = await supabase.auth.updateUser({
    //     data: {
    //       full_name: info.fullName,
    //       avatar_url: info.avatarUrl,
    //     },
    //   });

    //   if (updateError) throw updateError;
    } catch (error) {
      console.error("Error updating user info:", error);
      throw error;
    }
  }

  //   async getUserAddress(userId: string) {
  //     try {
  //       const { data, error } = await supabase
  //         .from("user_personal_info")
  //         .select("address")
  //         .eq("user_id", userId)
  //         .single();

  //       if (error) throw error;
  //       return data?.address;
  //     } catch (error) {
  //       console.error("Error getting user address:", error);
  //       throw error;
  //     }
  //   }
}

export const userService = new UserService();
