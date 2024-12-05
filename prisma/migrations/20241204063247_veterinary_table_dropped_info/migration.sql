/*
  Warnings:

  - You are about to drop the column `info` on the `technicians` table. All the data in the column will be lost.
  - You are about to alter the column `availability` on the `technicians` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(9))` to `TinyInt`.
  - You are about to drop the column `info` on the `veterinarian` table. All the data in the column will be lost.
  - You are about to alter the column `availability` on the `veterinarian` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(17))` to `TinyInt`.
  - Made the column `experience` on table `technicians` required. This step will fail if there are existing NULL values in that column.
  - Made the column `experience` on table `veterinarian` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `technicians` DROP COLUMN `info`,
    MODIFY `experience` VARCHAR(191) NOT NULL,
    MODIFY `availability` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `veterinarian` DROP COLUMN `info`,
    MODIFY `experience` VARCHAR(191) NOT NULL,
    MODIFY `availability` BOOLEAN NOT NULL DEFAULT true;
