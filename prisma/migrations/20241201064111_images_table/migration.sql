/*
  Warnings:

  - The values [Busy] on the enum `technicians_availability` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `technicians` MODIFY `availability` ENUM('Available', 'Unavailable') NOT NULL DEFAULT 'Available';
