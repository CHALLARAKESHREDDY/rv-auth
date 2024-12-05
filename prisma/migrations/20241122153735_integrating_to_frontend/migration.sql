/*
  Warnings:

  - You are about to drop the column `age` on the `cattle` table. All the data in the column will be lost.
  - You are about to drop the column `contactInfo` on the `cattle` table. All the data in the column will be lost.
  - You are about to drop the column `milkYield` on the `cattle` table. All the data in the column will be lost.
  - You are about to alter the column `status` on the `cattle` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(9))` to `Enum(EnumId(12))`.
  - You are about to alter the column `deliveryOptions` on the `cattle` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(10))` to `Enum(EnumId(10))`.
  - You are about to drop the column `condition` on the `farm_tools` table. All the data in the column will be lost.
  - You are about to drop the column `contactInfo` on the `farm_tools` table. All the data in the column will be lost.
  - You are about to drop the column `purchaseYear` on the `farm_tools` table. All the data in the column will be lost.
  - The values [MACHINERY,SPRAYERS,HAND_TOOLS,IRRIGATION_TOOLS,SAFETY_TOOLS,OTHER_TOOLS] on the enum `farm_tools_type` will be removed. If these variants are still used in the database, this will fail.
  - You are about to alter the column `status` on the `farm_tools` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(6))` to `Enum(EnumId(12))`.
  - You are about to alter the column `deliveryOptions` on the `farm_tools` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(7))` to `Enum(EnumId(10))`.
  - The values [CATTLE,TOOL,CROP] on the enum `myposts_itemType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to alter the column `type` on the `technicians` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(1))` to `Enum(EnumId(14))`.
  - You are about to alter the column `availability` on the `technicians` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(5))` to `Enum(EnumId(15))`.
  - You are about to alter the column `name` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(30)` to `VarChar(20)`.
  - You are about to alter the column `specialty` on the `veterinarian` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(3))` to `Enum(EnumId(13))`.
  - Added the required column `type` to the `cattle` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `cattle` required. This step will fail if there are existing NULL values in that column.
  - Made the column `price` on table `cattle` required. This step will fail if there are existing NULL values in that column.
  - Made the column `latitude` on table `cattle` required. This step will fail if there are existing NULL values in that column.
  - Made the column `longitude` on table `cattle` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `farm_tools` required. This step will fail if there are existing NULL values in that column.
  - Made the column `price` on table `farm_tools` required. This step will fail if there are existing NULL values in that column.
  - Made the column `latitude` on table `farm_tools` required. This step will fail if there are existing NULL values in that column.
  - Made the column `longitude` on table `farm_tools` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `cattle` DROP COLUMN `age`,
    DROP COLUMN `contactInfo`,
    DROP COLUMN `milkYield`,
    ADD COLUMN `type` ENUM('Cow', 'Bull', 'Buffalo', 'Sheep', 'Goat', 'Hen', 'Dog', 'OTHERS') NOT NULL,
    MODIFY `name` VARCHAR(191) NULL,
    MODIFY `description` VARCHAR(191) NOT NULL,
    MODIFY `price` INTEGER NOT NULL,
    MODIFY `latitude` DOUBLE NOT NULL,
    MODIFY `longitude` DOUBLE NOT NULL,
    MODIFY `status` ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',
    MODIFY `deliveryOptions` ENUM('Self_pickup', 'Delivery_available') NOT NULL DEFAULT 'Self_pickup';

-- AlterTable
ALTER TABLE `farm_tools` DROP COLUMN `condition`,
    DROP COLUMN `contactInfo`,
    DROP COLUMN `purchaseYear`,
    MODIFY `name` VARCHAR(191) NULL,
    MODIFY `type` ENUM('Machinery', 'Sprayers', 'Hand_tools', 'Irrigation_tools', 'safety_tools', 'Others') NOT NULL,
    MODIFY `description` VARCHAR(191) NOT NULL,
    MODIFY `price` INTEGER NOT NULL,
    MODIFY `latitude` DOUBLE NOT NULL,
    MODIFY `longitude` DOUBLE NOT NULL,
    MODIFY `status` ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',
    MODIFY `deliveryOptions` ENUM('Self_pickup', 'Delivery_available') NOT NULL DEFAULT 'Self_pickup';

-- AlterTable
ALTER TABLE `myposts` MODIFY `itemType` ENUM('Cattle', 'Tool', 'Harvest', 'TransPortation') NOT NULL;

-- AlterTable
ALTER TABLE `technicians` MODIFY `type` ENUM('Electrician', 'Mechanic') NOT NULL DEFAULT 'Electrician',
    MODIFY `availability` ENUM('Available', 'Unavailable', 'Busy') NOT NULL DEFAULT 'Available';

-- AlterTable
ALTER TABLE `users` MODIFY `name` VARCHAR(20) NOT NULL;

-- AlterTable
ALTER TABLE `veterinarian` MODIFY `specialty` ENUM('General', 'Surgeon', 'Nutrition', 'Dental') NOT NULL DEFAULT 'General';

-- CreateTable
CREATE TABLE `harvest` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `type` ENUM('Vegetables', 'Fruits', 'Spices', 'Plants', 'Seeds', 'Manure', 'Grass', 'Crops') NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `quantity` VARCHAR(191) NOT NULL,
    `price` INTEGER NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `latitude` DOUBLE NOT NULL,
    `longitude` DOUBLE NOT NULL,
    `status` ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',
    `deliveryOptions` ENUM('Self_pickup', 'Delivery_available') NOT NULL DEFAULT 'Self_pickup',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `postedById` INTEGER NOT NULL,

    INDEX `harvest_name_idx`(`name`),
    INDEX `harvest_latitude_longitude_idx`(`latitude`, `longitude`),
    INDEX `harvest_type_idx`(`type`),
    INDEX `farm_tools_postedById_fkey`(`postedById`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `harvest_iamges` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `url` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `harvestId` INTEGER NOT NULL,

    INDEX `harvest_iamges_harvestId_idx`(`harvestId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transportation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` ENUM('Lorry', 'Truck', 'Tractor', 'Auto', 'Others') NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `latitude` DOUBLE NOT NULL,
    `longitude` DOUBLE NOT NULL,
    `status` ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `postedById` INTEGER NOT NULL,

    INDEX `transportation_latitude_longitude_idx`(`latitude`, `longitude`),
    INDEX `transportation_type_idx`(`type`),
    INDEX `farm_tools_postedById_fkey`(`postedById`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `vechile_images` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `url` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `transportationId` INTEGER NOT NULL,

    INDEX `vechile_images_transportationId_idx`(`transportationId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `cattle_type_idx` ON `cattle`(`type`);

-- AddForeignKey
ALTER TABLE `harvest` ADD CONSTRAINT `harvest_postedById_fkey` FOREIGN KEY (`postedById`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `harvest_iamges` ADD CONSTRAINT `harvest_iamges_harvestId_fkey` FOREIGN KEY (`harvestId`) REFERENCES `harvest`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transportation` ADD CONSTRAINT `transportation_postedById_fkey` FOREIGN KEY (`postedById`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `vechile_images` ADD CONSTRAINT `vechile_images_transportationId_fkey` FOREIGN KEY (`transportationId`) REFERENCES `transportation`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
