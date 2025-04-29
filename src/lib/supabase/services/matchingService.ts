import { supabase } from "../../supabase";
import { User } from '../../../types/user';
import { MatchingFilters } from "../../../types/matching";
import {Pet} from '../../../types/pet'



class MatchingService {
    async getMatches(filters: MatchingFilters): Promise<Pet[]> {
        try {
            // Fetch potential matches
            let query = supabase
                .from('pets')
                .select(`
                 *,
                 owner:profiles!user_id (
                   id,
                   full_name,
                   email,
                   is_active,
                   avatar_url,
                   location:addresses (
                     id,
                     city,
                     state,
                     country,
                     postal_code,
                     lat,
                     lng
                   )
                 ),medicalHistory:pet_medical_records (
                 id,
                 date,
                 condition,
                 treatment,
                 veterinarian,
                 notes
               ),vaccinations:pet_vaccinations (
                 id,
                 name,
                 date,
                 next_due_date,
                 administrator,
                 batch_number,
                 manufacturer
               )  
               `)
                .neq('id', filters.selectedPetId)
                .eq('is_active', true)

            // Apply filters
            if (filters.breed) {
                query = query.eq('breed', filters.breed);
            }

            if (filters.gender) {
                query = query.eq('gender', filters.gender);
            }

            // Filter by matchmaking enabled status
            query = query.eq('matchmaking->enabled', true);

            // Filter by matchmaking purpose if specified
            if (filters.purpose) {
                // Use ? operator to check if the purposes array contains the value
                query = query.contains('matchmaking->purposes', `["${filters.purpose}"]`);
            }

            if (filters.ageRange) {
                const { min, max } = filters.ageRange;

                if (min && min.trim() !== '') query = query.gte('date_of_birth', min);
                if (max && max.trim() !== '') query = query.lte('date_of_birth', max);
            }


            if (filters.temperament?.length) {
                const orTemperaments = filters.temperament
                    .map(t => `temperament.cs.["${t}"]`)
                    .join(',');
                query = query.or(orTemperaments);
            }
           
            const { data, error } = await query;
        
        
            if (error) throw error;

            return data;
        }
        catch (error) {
            console.error("Error getting user info:", error);
            throw error;
        }
    }

}

export const matchingService = new MatchingService();
