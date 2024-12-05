/*
  Warnings:

  - You are about to drop the `vechile_images` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `price` to the `transportation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `vechile_images` DROP FOREIGN KEY `vechile_images_transportationId_fkey`;

-- AlterTable
ALTER TABLE `transportation` ADD COLUMN `name` VARCHAR(191) NULL,
    ADD COLUMN `price` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `vechile_images`;

-- CreateTable
CREATE TABLE `transportation_images` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `url` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `transportationId` INTEGER NOT NULL,

    INDEX `transportation_images_transportationId_idx`(`transportationId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `transportation_images` ADD CONSTRAINT `transportation_images_transportationId_fkey` FOREIGN KEY (`transportationId`) REFERENCES `transportation`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
