/*
  # Add Pet Health Records Schema

  1. New Tables
    - `pet_medical_records`
      - For storing medical history
    - `pet_vaccinations`
      - For storing vaccination records
  
  2. Changes
    - Added foreign key relationships to pets table
    - Added appropriate indexes for performance
  
  3. Security
    - Enable RLS on new tables
    - Add policies for owner access
*/

-- Medical Records table
CREATE TABLE IF NOT EXISTS pet_medical_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id uuid REFERENCES pets(id) ON DELETE CASCADE,
  date date NOT NULL,
  condition text NOT NULL,
  treatment text NOT NULL,
  veterinarian text NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Vaccinations table
CREATE TABLE IF NOT EXISTS pet_vaccinations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id uuid REFERENCES pets(id) ON DELETE CASCADE,
  name text NOT NULL,
  date date NOT NULL,
  next_due_date date NOT NULL,
  administrator text NOT NULL,
  batch_number text,
  manufacturer text,
  created_at timestamptz DEFAULT now()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_medical_records_pet_id ON pet_medical_records(pet_id);
CREATE INDEX IF NOT EXISTS idx_vaccinations_pet_id ON pet_vaccinations(pet_id);

-- Enable RLS
ALTER TABLE pet_medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE pet_vaccinations ENABLE ROW LEVEL SECURITY;

-- Policies for medical records
CREATE POLICY "Users can view their pets' medical records"
  ON pet_medical_records FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM pets
      WHERE pets.id = pet_medical_records.pet_id
      AND pets.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage their pets' medical records"
  ON pet_medical_records FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM pets
      WHERE pets.id = pet_medical_records.pet_id
      AND pets.owner_id = auth.uid()
    )
  );

-- Policies for vaccinations
CREATE POLICY "Users can view their pets' vaccinations"
  ON pet_vaccinations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM pets
      WHERE pets.id = pet_vaccinations.pet_id
      AND pets.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage their pets' vaccinations"
  ON pet_vaccinations FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM pets
      WHERE pets.id = pet_vaccinations.pet_id
      AND pets.owner_id = auth.uid()
    )
  );