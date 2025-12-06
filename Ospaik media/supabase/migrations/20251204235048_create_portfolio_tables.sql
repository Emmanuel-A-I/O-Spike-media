/*
  # O Spaik Media Portfolio Database

  ## Overview
  This migration creates the necessary tables for the O Spaik Media videography portfolio website.

  ## New Tables

  ### `bookings`
  Stores client booking requests for videography services.
  - `id` (uuid, primary key): Unique identifier for each booking
  - `name` (text, required): Client's full name
  - `email` (text, required): Client's email address
  - `phone` (text): Client's phone number
  - `event_type` (text, required): Type of event (wedding, corporate, music video, etc.)
  - `event_date` (date, required): Proposed date of the event
  - `budget` (text): Client's budget range
  - `message` (text): Additional details or special requests
  - `status` (text, default 'pending'): Booking status (pending, confirmed, cancelled)
  - `created_at` (timestamptz): Timestamp when booking was created

  ### `contact_messages`
  Stores messages from the contact form.
  - `id` (uuid, primary key): Unique identifier for each message
  - `name` (text, required): Sender's full name
  - `email` (text, required): Sender's email address
  - `subject` (text): Message subject
  - `message` (text, required): Message content
  - `read` (boolean, default false): Whether the message has been read
  - `created_at` (timestamptz): Timestamp when message was sent

  ## Security
  
  ### Row Level Security (RLS)
  - Both tables have RLS enabled
  - Anonymous users can INSERT bookings and contact messages (public forms)
  - Only authenticated admin users can SELECT/UPDATE bookings and messages (for future admin panel)
  
  ## Notes
  - Both tables use `gen_random_uuid()` for automatic ID generation
  - Timestamps are automatically set to current time
  - Email validation should be handled on the frontend
  - Consider adding email notifications for new bookings/messages in the future
*/

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  event_type text NOT NULL,
  event_date date NOT NULL,
  budget text,
  message text,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Create contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text,
  message text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Policies for bookings table
CREATE POLICY "Anyone can create bookings"
  ON bookings FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view all bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policies for contact_messages table
CREATE POLICY "Anyone can send contact messages"
  ON contact_messages FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view all messages"
  ON contact_messages FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update messages"
  ON contact_messages FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);