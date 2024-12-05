/*
  Warnings:

  - You are about to drop the column `breed` on the `cattle` table. All the data in the column will be lost.
  - You are about to drop the column `weight` on the `cattle` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `harvest` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `cattle` DROP COLUMN `breed`,
    DROP COLUMN `weight`;

-- AlterTable
ALTER TABLE `harvest` DROP COLUMN `quantity`;
