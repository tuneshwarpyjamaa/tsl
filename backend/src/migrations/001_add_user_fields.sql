-- Add new columns to the users table
ALTER TABLE users ADD COLUMN "username" VARCHAR(255) UNIQUE;
ALTER TABLE users ADD COLUMN "firstName" VARCHAR(255);
ALTER TABLE users ADD COLUMN "lastName" VARCHAR(255);
ALTER TABLE users ADD COLUMN "displayName" VARCHAR(255);
ALTER TABLE users ADD COLUMN bio TEXT;
ALTER TABLE users ADD COLUMN "dateOfBirth" DATE;
ALTER TABLE users ADD COLUMN "websiteUrl" VARCHAR(255);
ALTER TABLE users ADD COLUMN "profilePictureUrl" VARCHAR(255);
