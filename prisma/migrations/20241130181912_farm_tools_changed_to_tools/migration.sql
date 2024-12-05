/*
  Warnings:

  - You are about to drop the `farm_tools` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `farm_tool_images` DROP FOREIGN KEY `farm_tool_images_farmToolId_fkey`;

-- DropForeignKey
ALTER TABLE `farm_tools` DROP FOREIGN KEY `farm_tools_postedById_fkey`;

-- DropTable
DROP TABLE `farm_tools`;

-- CreateTable
CREATE TABLE `tools` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `type` ENUM('Machinery', 'Sprayers', 'Safety', 'Irrigation', 'Others') NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `price` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `latitude` DOUBLE NOT NULL,
    `longitude` DOUBLE NOT NULL,
    `status` ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',
    `deliveryOptions` ENUM('Self_pickup', 'Delivery_available') NOT NULL DEFAULT 'Self_pickup',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `postedById` INTEGER NOT NULL,

    INDEX `tools_latitude_longitude_updatedAt_idx`(`latitude`, `longitude`, `updatedAt`),
    INDEX `tools_name_idx`(`name`),
    INDEX `tools_type_idx`(`type`),
    INDEX `farm_tools_postedById_fkey`(`postedById`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tools` ADD CONSTRAINT `tools_postedById_fkey` FOREIGN KEY (`postedById`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `farm_tool_images` ADD CONSTRAINT `farm_tool_images_farmToolId_fkey` FOREIGN KEY (`farmToolId`) REFERENCES `tools`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
