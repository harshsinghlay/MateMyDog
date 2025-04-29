import { supabase } from "../supabase";
import type {
  Pet,
  MedicalRecord,
  Vaccination,
} from "../../types/pet";

export class PetService {
  public toDbFormat(pet: Partial<Pet>) {

    // Handle both cases where owner might be an object or just an ID
    const ownerId = typeof pet.owner === 'object' ? pet.owner.id : pet.owner;

    return {
      name: pet.name,
      image_url: pet.imageUrl,
      user_id: ownerId,
      date_of_birth: pet.dateOfBirth,
      temperament: pet.temperament || [],
      microchip_id: pet.microchipId || "",
      is_active: pet.isActive,
      breed: pet.breed,
      gender: pet.gender,
      weight: pet.weight,
      matchmaking: pet.matchmaking || null
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async fromDbFormat(dbPet: any): Promise<Pet> {
    if (!dbPet) throw new Error("Invalid pet data");
    

    return {
      id: dbPet.id,
      name: dbPet.name || "",
      breed: dbPet.breed || "",
      age: this.formatAge(dbPet.date_of_birth),
      gender: dbPet.gender || "male",
      imageUrl: dbPet.image_url || "",
      dateOfBirth:
        dbPet.date_of_birth || new Date().toISOString().split("T")[0],
      weight: dbPet.weight || 0,
      microchipId: dbPet.microchip_id || "",
      temperament: dbPet.temperament || [],
      medicalHistory: dbPet.medicalHistory || [],
      vaccinations: dbPet.vaccinations || [],
      isActive: dbPet.is_active,
      isVerified: dbPet.is_verified,
      matchmaking: dbPet.matchmaking,
      owner: {
        ...dbPet.owner,
        isActive: dbPet.owner.is_active,
        fullName: dbPet.owner.full_name,
      }
    };
  }

  public formatAge(dob: string | null): string {
    if (!dob) return "0yrs 0mons 0days";

    const birthDate = new Date(dob);
    const today = new Date();

    if (birthDate > today) return "0yrs 0mons 0days";

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    // Adjust days if negative
    if (days < 0) {
      months--;
      const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += lastMonth.getDate();
    }

    // Adjust months if negative
    if (months < 0) {
      years--;
      months += 12;
    }

    // return `${years}yr${years !== 1 ? 's' : ''} ${months}mon${months !== 1 ? 's' : ''} ${days}day${days !== 1 ? 's' : ''}`;
    let result = '';
    if (years > 0) {
      result += `${years}yr`;
    }
    if (months > 0) {
      result += `${months}mon`;
    }
    result += `${days}day`; // days should always be included
    return result;
  }


  async getUserPets(userId: string) {
    if (!userId) throw new Error("User ID is required");

    try {
      const { data, error } = await supabase
        .from("pets")
        .select(`
          *,
          owner:profiles!user_id (
            id,
            full_name,
            email,
            is_active,
            location:addresses (
              id,
              city,
              state,
              country,
              postal_code,
              lat,
              lng
            )
          ),
          medicalHistory:pet_medical_records (
            id,
            date,
            condition,
            treatment,
            veterinarian,
            notes
          ),
           vaccinations:pet_vaccinations (
            id,
            name,
            date,
            next_due_date,
            administrator,
            batch_number,
            manufacturer
          )  
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const pets = await Promise.all(
        (data || []).map((pet) => this.fromDbFormat(pet))
      );

      return pets;
    } catch (error) {
      console.error("Pet service :: getUserPets :: error", error);
      throw error;
    }
  }

  public async getPet(id: string): Promise<Pet> {
    if (!id) throw new Error("Pet ID is required");

    try {
      const { data: pet, error } = await supabase
        .from("pets")
        .select(`
          *,
          owner:profiles!user_id (
            id,
            full_name,
            email,
            is_active,
            location:addresses (
              id,
              city,
              state,
              country,
              postal_code,
              lat,
              lng
            )
          ),
          medicalHistory:pet_medical_records (
            id,
            date,
            condition,
            treatment,
            veterinarian,
            notes
          ),
           vaccinations:pet_vaccinations (
            id,
            name,
            date,
            next_due_date,
            administrator,
            batch_number,
            manufacturer
          )
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      if (!pet) throw new Error("Pet not found");

      return this.fromDbFormat(pet);
    } catch (error) {
      console.error("Pet service :: getPet (joined) :: error", error);
      throw error;
    }
  }


  async addPet(pet: Omit<Pet, "id">) {
    if (!pet.owner) throw new Error("Owner ID is required");

    try {
      const { medicalHistory, vaccinations, ...petData } = pet;

      const { data: newPet, error: petError } = await supabase
        .from("pets")
        .insert([this.toDbFormat(petData)])
        .select(`
          *,
          owner:profiles!user_id (
            id,
            full_name,
            email,
            is_active,
            location:addresses (
              id,
              city,
              state,
              country,
              postal_code,
              lat,
              lng
            )
          ),
          medicalHistory:pet_medical_records (
            id,
            date,
            condition,
            treatment,
            veterinarian,
            notes
          ),
           vaccinations:pet_vaccinations (
            id,
            name,
            date,
            next_due_date,
            administrator,
            batch_number,
            manufacturer
          )
        `)
        .single();

      if (petError) throw petError;
      if (!newPet) throw new Error("Failed to create pet");

      if (medicalHistory?.length) {
        const { error: medicalError } = await supabase
          .from("pet_medical_records")
          .insert(
            medicalHistory.map((record) => ({
              pet_id: newPet.id,
              date: record.date,
              condition: record.condition,
              treatment: record.treatment,
              veterinarian: record.veterinarian,
              notes: record.notes,
            }))
          );
        if (medicalError) throw medicalError;
      }

      if (vaccinations?.length) {
        const { error: vaccinationError } = await supabase
          .from("pet_vaccinations")
          .insert(
            vaccinations.map((vaccination) => ({
              pet_id: newPet.id,
              name: vaccination.name,
              date: vaccination.date,
              next_due_date: vaccination.nextDueDate,
              administrator: vaccination.administrator,
              batch_number: vaccination.batchNumber,
              manufacturer: vaccination.manufacturer,
            }))
          );
        if (vaccinationError) throw vaccinationError;
      }

      return this.fromDbFormat(newPet);
    } catch (error) {
      console.error("Pet service :: addPet :: error", error);
      throw error;
    }
  }

  async updatePet(id: string, pet: Partial<Pet>) {
    if (!id) throw new Error("Pet ID is required");

    try {
      const { medicalHistory, vaccinations, ...petData } = pet;

      const { data: updatedPet, error: petError } = await supabase
        .from("pets")
        .update(this.toDbFormat(petData))
        .eq("id", id)
        .select(`
          *,
          owner:profiles!user_id (
            id,
            full_name,
            email,
            is_active,
            location:addresses (
              id,
              city,
              state,
              country,
              postal_code,
              lat,
              lng
            )
          )
        `)
        .single();

      if (petError) throw petError;
      if (!updatedPet) throw new Error("Failed to update pet");

      if (medicalHistory) {
        await supabase.from("pet_medical_records").delete().eq("pet_id", id);

        if (medicalHistory.length) {
          const { error: medicalError } = await supabase
            .from("pet_medical_records")
            .insert(
              medicalHistory.map((record) => ({
                pet_id: id,
                date: record.date,
                condition: record.condition,
                treatment: record.treatment,
                veterinarian: record.veterinarian,
                notes: record.notes,
              }))
            );
          if (medicalError) throw medicalError;
        }
      }

      if (vaccinations) {
        const { error: deleteError } = await supabase
          .from("pet_vaccinations")
          .delete()
          .eq("pet_id", id);

        if (deleteError) throw deleteError;

        if (vaccinations.length) {
          const { error: vaccinationError } = await supabase
            .from("pet_vaccinations")
            .insert(
              vaccinations.map((vaccination) => ({
                pet_id: id,
                name: vaccination.name,
                date: vaccination.date,
                next_due_date:
                  vaccination.nextDueDate ||
                  new Date(vaccination.date).toISOString().split("T")[0],
                administrator: vaccination.administrator,
                batch_number: vaccination.batchNumber || null,
                manufacturer: vaccination.manufacturer || null,
              }))
            );
          if (vaccinationError) throw vaccinationError;
        }
      }

      return this.fromDbFormat(updatedPet);
    } catch (error) {
      console.error("Pet service :: updatePet :: error", error);
      throw error;
    }
  }

  async uploadFile(file: File) {
    if (!file) throw new Error("File is required");

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `pet-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("pets")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("pets").getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error("Pet service :: uploadFile :: error", error);
      throw error;
    }
  }

  async deleteFile(path: string) {
    if (!path) throw new Error("File path is required");

    try {
      const { error } = await supabase.storage.from("pets").remove([path]);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Pet service :: deleteFile :: error", error);
      throw error;
    }
  }



  async addMedicalRecord(
    petId: string,
    record: Omit<MedicalRecord, "id">
  ): Promise<Pet> {
    if (!petId) throw new Error("Pet ID is required");

    try {
      const { error } = await supabase.from("pet_medical_records").insert({
        pet_id: petId,
        date: record.date,
        condition: record.condition,
        treatment: record.treatment,
        veterinarian: record.veterinarian,
        notes: record.notes,
      });

      if (error) throw error;

      return this.getPet(petId);
    } catch (error) {
      console.error("Pet service :: addMedicalRecord :: error", error);
      throw error;
    }
  }

  async addVaccination(
    petId: string,
    vaccination: Omit<Vaccination, "id">
  ): Promise<Pet> {
    if (!petId) throw new Error("Pet ID is required");

    try {
      const { error } = await supabase.from("pet_vaccinations").insert({
        pet_id: petId,
        name: vaccination.name,
        date: vaccination.date,
        next_due_date: vaccination.nextDueDate || vaccination.date,
        administrator: vaccination.administrator,
        batch_number: vaccination.batchNumber,
        manufacturer: vaccination.manufacturer,
      });

      if (error) throw error;

      return this.getPet(petId);
    } catch (error) {
      console.error("Pet service :: addVaccination :: error", error);
      throw error;
    }
  }
}

export const petService = new PetService();
