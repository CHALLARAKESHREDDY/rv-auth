/*
  Warnings:

  - You are about to drop the `harvest_iamges` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `harvest_iamges` DROP FOREIGN KEY `harvest_iamges_harvestId_fkey`;

-- DropTable
DROP TABLE `harvest_iamges`;

-- CreateTable
CREATE TABLE `harvest_images` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `url` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `harvestId` INTEGER NOT NULL,

    INDEX `harvest_images_harvestId_idx`(`harvestId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `harvest_images` ADD CONSTRAINT `harvest_images_harvestId_fkey` FOREIGN KEY (`harvestId`) REFERENCES `harvest`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
