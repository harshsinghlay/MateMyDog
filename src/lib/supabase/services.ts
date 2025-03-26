import { supabase } from "../supabase";
import type {
  Pet,
  MedicalRecord,
  Vaccination,
  Review,
  Comment,
  Like,
} from "../../types/pet";

export class PetService {
  private toDbFormat(pet: Partial<Pet>) {
    const { imageUrl, ownerId, ownerName, dateOfBirth, microchipId, ...rest } =
      pet;

    return {
      ...rest,
      image_url: imageUrl,
      owner_id: ownerId,
      owner_name: ownerName,
      date_of_birth: dateOfBirth,
      temperament: rest.temperament || [],
      location: rest.location ? JSON.stringify(rest.location) : null,
      media: rest.media || [],
      likes: rest.likes || [],
      reviews: rest.reviews || [],
      comments: rest.comments || [],
      rating: rest.rating || 0,
      microchip_id: microchipId || "",
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async fromDbFormat(dbPet: any): Promise<Pet> {
    if (!dbPet) throw new Error("Invalid pet data");

    const { data: medicalRecords } = await supabase
      .from("pet_medical_records")
      .select("*")
      .eq("pet_id", dbPet.id)
      .order("date", { ascending: false });

    const { data: vaccinations } = await supabase
      .from("pet_vaccinations")
      .select("*")
      .eq("pet_id", dbPet.id)
      .order("date", { ascending: false });


    return {
      id: dbPet.id,
      name: dbPet.name || "",
      breed: dbPet.breed || "",
      age: dbPet.age || 0,
      gender: dbPet.gender || "male",
      imageUrl: dbPet.image_url || "",
      ownerId: dbPet.owner_id || "",
      ownerName: dbPet.owner_name || "",
      dateOfBirth:
      dbPet.date_of_birth || new Date().toISOString().split("T")[0],
      weight: dbPet.weight || 0,
      microchipId: dbPet.microchip_id || "",
      temperament: dbPet.temperament || [],
      location : dbPet.location ? JSON.parse(dbPet.location) : null,
      media: dbPet.media || [],
      likes: dbPet.likes || [],
      reviews: dbPet.reviews || [],
      comments: dbPet.comments || [],
      rating: dbPet.rating || 0,
      medicalHistory: medicalRecords || [],
      vaccinations: vaccinations || [],
    };
  }

  async getUserPets(userId: string) {
    if (!userId) throw new Error("User ID is required");

    try {
      const { data, error } = await supabase
        .from("pets")
        .select("*")
        .eq("owner_id", userId)
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

  async getPet(id: string): Promise<Pet> {
    if (!id) throw new Error("Pet ID is required");

    try {
      const { data: pet, error: petError } = await supabase
        .from("pets")
        .select("*")
        .eq("id", id)
        .single();

      if (petError) throw petError;
      if (!pet) throw new Error("Pet not found");

      return this.fromDbFormat(pet);
    } catch (error) {
      console.error("Pet service :: getPet :: error", error);
      throw error;
    }
  }

  async addPet(pet: Omit<Pet, "id">) {
    if (!pet.ownerId) throw new Error("Owner ID is required");
    

    try {
      const { medicalHistory, vaccinations, ...petData } = pet;

      const { data: newPet, error: petError } = await supabase
        .from("pets")
        .insert([this.toDbFormat(petData)])
        .select()
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
        .select()
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

  async deletePet(id: string) {
    if (!id) throw new Error("Pet ID is required");

    try {
      const { error } = await supabase.from("pets").delete().eq("id", id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Pet service :: deletePet :: error", error);
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

  async likePet(petId: string, userId: string, userName: string): Promise<Pet> {
    if (!petId || !userId) throw new Error("Pet ID and User ID are required");

    try {
      const pet = await this.getPet(petId);
      const hasLiked = pet.likes.some((like) => like.userId === userId);

      let updatedLikes;
      if (hasLiked) {
        updatedLikes = pet.likes.filter((like) => like.userId !== userId);
      } else {
        const newLike: Like = {
          id: crypto.randomUUID(),
          userId,
          userName: userName || "Anonymous",
          timestamp: new Date().toISOString(),
        };
        updatedLikes = [...pet.likes, newLike];
      }

      const { data: updatedPet, error } = await supabase
        .from("pets")
        .update({ likes: updatedLikes })
        .eq("id", petId)
        .select()
        .single();

      if (error) throw error;
      return this.fromDbFormat(updatedPet);
    } catch (error) {
      console.error("Pet service :: likePet :: error", error);
      throw error;
    }
  }

  async reviewPet(
    petId: string,
    userId: string,
    userName: string,
    rating: number,
    comment: string
  ): Promise<Pet> {
    if (!petId || !userId) throw new Error("Pet ID and User ID are required");

    try {
      const pet = await this.getPet(petId);
      const newReview: Review = {
        id: crypto.randomUUID(),
        userId,
        userName: userName || "Anonymous",
        rating,
        comment,
        timestamp: new Date().toISOString(),
        likes: 0,
      };

      const updatedReviews = [...pet.reviews, newReview];
      const averageRating =
        updatedReviews.reduce((acc, review) => acc + review.rating, 0) /
        updatedReviews.length;

      const { data: updatedPet, error } = await supabase
        .from("pets")
        .update({
          reviews: updatedReviews,
          rating: Math.round(averageRating * 10) / 10,
        })
        .eq("id", petId)
        .select()
        .single();

      if (error) throw error;
      return this.fromDbFormat(updatedPet);
    } catch (error) {
      console.error("Pet service :: reviewPet :: error", error);
      throw error;
    }
  }

  async postComment(
    petId: string,
    userId: string,
    userName: string,
    content: string
  ): Promise<Pet> {
    if (!petId || !userId) throw new Error("Pet ID and User ID are required");

    try {
      const pet = await this.getPet(petId);
      const newComment: Comment = {
        id: crypto.randomUUID(),
        userId,
        userName: userName || "Anonymous",
        content,
        timestamp: new Date().toISOString(),
        likes: 0,
      };

      const { data: updatedPet, error } = await supabase
        .from("pets")
        .update({
          comments: [...pet.comments, newComment],
        })
        .eq("id", petId)
        .select()
        .single();

      if (error) throw error;
      return this.fromDbFormat(updatedPet);
    } catch (error) {
      console.error("Pet service :: postComment :: error", error);
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
