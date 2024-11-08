-- CreateTable
CREATE TABLE `cattle` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `age` INTEGER NULL,
    `breed` VARCHAR(191) NULL,
    `weight` DOUBLE NULL,
    `price` INTEGER NULL,
    `milkYield` DOUBLE NULL,
    `location` VARCHAR(191) NOT NULL,
    `latitude` DOUBLE NULL,
    `longitude` DOUBLE NULL,
    `postedById` INTEGER NOT NULL,
    `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    `deliveryOptions` ENUM('SELF_PICKUP', 'DELIVERY_AVAILABLE') NOT NULL DEFAULT 'SELF_PICKUP',
    `contactInfo` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `cattle_latitude_longitude_idx`(`latitude`, `longitude`),
    INDEX `cattle_name_idx`(`name`),
    INDEX `cattle_postedById_fkey`(`postedById`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cattle_images` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `url` VARCHAR(191) NOT NULL,
    `cattleId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `cattle_images_cattleId_fkey`(`cattleId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `cattle` ADD CONSTRAINT `cattle_postedById_fkey` FOREIGN KEY (`postedById`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cattle_images` ADD CONSTRAINT `cattle_images_cattleId_fkey` FOREIGN KEY (`cattleId`) REFERENCES `cattle`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
