/*
  # Pet Management Schema

  1. New Tables
    - `pets`
      - Main table for pet information
      - Includes basic pet details and owner reference
    - `pet_health_records`
      - Medical history and vaccination records
      - References pets table
    - `pet_reviews`
      - Social interactions (likes, reviews, comments)
      - References pets table

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Pets table
CREATE TABLE IF NOT EXISTS pets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  breed text NOT NULL,
  age integer NOT NULL,
  gender text NOT NULL,
  image_url text,
  date_of_birth date NOT NULL,
  weight numeric(5,2),
  microchip_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Pet health records
CREATE TABLE IF NOT EXISTS pet_health_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id uuid REFERENCES pets(id) ON DELETE CASCADE,
  record_type text NOT NULL, -- 'medical' or 'vaccination'
  date date NOT NULL,
  title text NOT NULL,
  description text,
  provider text,
  next_due_date date,
  created_at timestamptz DEFAULT now()
);

-- Pet reviews and social interactions
CREATE TABLE IF NOT EXISTS pet_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id uuid REFERENCES pets(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL, -- 'like', 'review', or 'comment'
  rating integer, -- For reviews only
  content text, -- For reviews and comments
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE pet_health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE pet_reviews ENABLE ROW LEVEL SECURITY;

-- Policies for pets
CREATE POLICY "Users can view all pets"
  ON pets FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage their own pets"
  ON pets FOR ALL
  TO authenticated
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- Policies for health records
CREATE POLICY "Users can view health records of their pets"
  ON pet_health_records FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM pets
    WHERE pets.id = pet_health_records.pet_id
    AND pets.owner_id = auth.uid()
  ));

CREATE POLICY "Users can manage health records of their pets"
  ON pet_health_records FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM pets
    WHERE pets.id = pet_health_records.pet_id
    AND pets.owner_id = auth.uid()
  ));

-- Policies for reviews
CREATE POLICY "Users can view all reviews"
  ON pet_reviews FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create reviews"
  ON pet_reviews FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own reviews"
  ON pet_reviews FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);