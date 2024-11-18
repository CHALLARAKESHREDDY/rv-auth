/*
  Warnings:

  - The values [Eelectrician,Mehanic] on the enum `users_occupation` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `users` MODIFY `occupation` ENUM('Farmer', 'Electrician', 'Veterinary', 'Mechanic', 'Guest') NOT NULL;
