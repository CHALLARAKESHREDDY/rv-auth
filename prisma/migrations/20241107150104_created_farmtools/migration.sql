-- CreateTable
CREATE TABLE `farm_tools` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `type` ENUM('MACHINERY', 'SPRAYERS', 'HAND_TOOLS', 'IRRIGATION_TOOLS', 'SAFETY_TOOLS', 'OTHER_TOOLS') NOT NULL,
    `description` VARCHAR(191) NULL,
    `price` INTEGER NULL,
    `location` VARCHAR(191) NOT NULL,
    `latitude` DOUBLE NULL,
    `longitude` DOUBLE NULL,
    `postedById` INTEGER NOT NULL,
    `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    `deliveryOptions` ENUM('SELF_PICKUP', 'DELIVERY_AVAILABLE') NOT NULL DEFAULT 'SELF_PICKUP',
    `condition` ENUM('New', 'Used', 'Refurbished') NOT NULL,
    `contactInfo` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `purchaseYear` INTEGER NULL,

    INDEX `farm_tools_name_idx`(`name`),
    INDEX `farm_tools_latitude_longitude_idx`(`latitude`, `longitude`),
    INDEX `farm_tools_type_idx`(`type`),
    INDEX `farm_tools_postedById_fkey`(`postedById`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `farm_tool_images` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `url` VARCHAR(191) NOT NULL,
    `farmToolId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `farm_tool_images_farmToolId_fkey`(`farmToolId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `farm_tools` ADD CONSTRAINT `farm_tools_postedById_fkey` FOREIGN KEY (`postedById`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `farm_tool_images` ADD CONSTRAINT `farm_tool_images_farmToolId_fkey` FOREIGN KEY (`farmToolId`) REFERENCES `farm_tools`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
