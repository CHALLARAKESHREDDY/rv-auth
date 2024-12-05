/*
  Warnings:

  - The values [OTHERS] on the enum `cattle_type` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `cattle` MODIFY `type` ENUM('Cow', 'Bull', 'Buffalo', 'Sheep', 'Goat', 'Hen', 'Dog', 'Others') NOT NULL;
