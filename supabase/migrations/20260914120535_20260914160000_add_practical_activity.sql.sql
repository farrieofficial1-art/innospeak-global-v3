/*
  # Add practical_activity column to lessons

  Adds a `practical_activity` text column to the `lessons` table so tutors
  can include hands-on activity instructions in their lessons. This is
  nullable and optional — existing lessons are unaffected.

  Also adds the `practical_activity` field reference for the lesson content
  builder. No RLS changes needed — the existing lesson policies already
  cover all columns in the table.
*/

ALTER TABLE lessons ADD COLUMN IF NOT EXISTS practical_activity text DEFAULT '';
