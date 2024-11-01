/*
  Warnings:

  - A unique constraint covering the columns `[phoneNumber]` on the table `otps` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `otps_phoneNumber_key` ON `otps`(`phoneNumber`);
