/*
  Warnings:

  - The values [Others] on the enum `harvest_type` will be removed. If these variants are still used in the database, this will fail.
  - The values [Dental] on the enum `veterinarian_specialty` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `harvest` MODIFY `type` ENUM('Vegetables', 'Fruits', 'Spices', 'Plants', 'Seeds', 'Manure', 'Grass', 'Crops') NOT NULL;

-- AlterTable
ALTER TABLE `veterinarian` ADD COLUMN `availability` ENUM('Available', 'Unavailable') NOT NULL DEFAULT 'Available',
    MODIFY `specialty` ENUM('General', 'Surgeon', 'Nutrition') NOT NULL DEFAULT 'General';
