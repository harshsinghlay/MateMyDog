import { supabase } from "../../supabase";
import { User, Address } from '../../../types/user';


class UserService {
  async getUserInfo(userId: string): Promise<User> {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*, location:addresses!location(*)")
        .eq("id", userId)
        .single();

      if (error) throw new Error("Failed to fetch user profile: " + error.message);
      
      return {
        id: data.id,
        fullName: data.full_name,
        email: data.email,
        avatarUrl: data.avatar_url,
        isActive: data.is_active,
        location: {
          id: data.location?.id,
          city: data.location?.city || "",
          state: data.location?.state || "",
          country: data.location?.country || "",
          postalCode: data.location?.postal_code || "",
          lat: data.location?.lat || "",
          lng: data.location?.lng || "",
        }
      };
    }
    catch (error) {
      console.error("Error getting user info:", error);
      throw error;
    }
  }

  async updateUserInfo(userId: string, info: User): Promise<void> {
    try {

      // Step 1: Update address using the  function
      await this.updateAddress(info.location);

      // Step 2: Update user profile 
      const { data, error } = await supabase
        .from("profiles")
        .upsert({
          id: userId,
          full_name: info.fullName,
          email: info.email,
          avatar_url: info.avatarUrl,
          is_active: info.isActive,
        })
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

  async updateUserActiveStatus(userId: string, isActive: boolean): Promise<void> {
    try {
      // First update all pets of this user
      const { error: petsError } = await supabase
        .from('pets')
        .update({ is_active: isActive })
        .eq('user_id', userId);

      if (petsError) throw new Error('Failed to update pets status');

      // Then update user profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ is_active: isActive })
        .eq('id', userId);

      if (profileError) throw new Error('Failed to update user status');

    } catch (error) {
      console.error("Error updating active status:", error);
      throw error;
    }
  }

  async getAddress(addressId: string): Promise<Address | null> {
    try {
      // Fetch the full address directly using userId
      const { data: address, error } = await supabase
        .from("addresses")
        .select("*")
        .eq("id", addressId)
        .single(); // Ensure only one record is fetched

      if (error) {
        if (error.code === "PGRST116") return null; // No record found
        throw new Error("Failed to fetch address: " + error.message);
      }

      // Return the mapped address object
      return {
        id : address.id,
        postalCode: address.postal_code,
        state: address.state,
        city: address.city,
        country: address.country,
        lat: address.lat,
        lng: address.lng,
      };
    } catch (error) {
      console.error("Error fetching address:", error);
      throw error;
    }
  }


  async updateAddress(addressInfo: Address): Promise<Address | null> {

    try {
      // Update address directly and return the updated record
      const { data, error } = await supabase
        .from("addresses")
        .update({
          postal_code: addressInfo.postalCode || "",
          state: addressInfo.state || "",
          city: addressInfo.city || "",
          country: addressInfo.country || "",
          lat: addressInfo.lat || "",
          lng: addressInfo.lng || "",
        })
        .eq("id", addressInfo.id) // Update based on user_id instead of fetching ID separately
        .select("*") // Select the updated record to return the ID
        .single(); // Ensure only one record is returned

      if (error) {
        throw new Error("Failed to update address: " + error.message);
      }

      return data;
    } catch (error) {
      console.error("Error updating address:", error);
      throw error;
    }
  }

}

export const userService = new UserService();
