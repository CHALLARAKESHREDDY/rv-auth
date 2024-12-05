/*
  Warnings:

  - The values [Tool,TransPortation] on the enum `wishlist_itemType` will be removed. If these variants are still used in the database, this will fail.
  - The values [Tool,TransPortation] on the enum `wishlist_itemType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `farm_tool_images` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `farm_tool_images` DROP FOREIGN KEY `farm_tool_images_farmToolId_fkey`;

-- AlterTable
ALTER TABLE `myposts` MODIFY `itemType` ENUM('Cattle', 'Tools', 'Harvest', 'Transportation') NOT NULL;

-- AlterTable
ALTER TABLE `wishlist` MODIFY `itemType` ENUM('Cattle', 'Tools', 'Harvest', 'Transportation') NOT NULL;

-- DropTable
DROP TABLE `farm_tool_images`;

-- CreateTable
CREATE TABLE `tools_images` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `url` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `farmToolId` INTEGER NOT NULL,

    INDEX `farm_tool_images_farmToolId_fkey`(`farmToolId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tools_images` ADD CONSTRAINT `tools_images_farmToolId_fkey` FOREIGN KEY (`farmToolId`) REFERENCES `tools`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
