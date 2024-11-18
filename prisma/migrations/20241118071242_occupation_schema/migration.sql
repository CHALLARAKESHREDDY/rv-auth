/*
  Warnings:

  - The values [FARMER,ELECTRICIAN,VETERINARY,FARMLABOUR,MECHANIC,GUEST] on the enum `users_occupation` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `users` MODIFY `occupation` ENUM('Farmer', 'Eelectrician', 'Veterinary', 'Mehanic', 'Guest') NOT NULL;
