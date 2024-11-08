-- AlterTable
ALTER TABLE `farm_tools` MODIFY `condition` ENUM('New', 'Used', 'Refurbished') NOT NULL DEFAULT 'New';

-- CreateTable
CREATE TABLE `veterinarian` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `specialty` ENUM('GENERAL', 'SURGEON', 'NUTRITION', 'DENTAL') NOT NULL DEFAULT 'GENERAL',
    `experience` INTEGER NULL,
    `verified` BOOLEAN NOT NULL DEFAULT false,
    `location` VARCHAR(191) NOT NULL,
    `latitude` DOUBLE NULL,
    `longitude` DOUBLE NULL,
    `info` VARCHAR(191) NULL,
    `imageUrl` VARCHAR(191) NULL,
    `averageRating` DOUBLE NULL DEFAULT 0,
    `ratingCount` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `veterinarian_userId_key`(`userId`),
    INDEX `veterinarian_latitude_longitude_idx`(`latitude`, `longitude`),
    INDEX `veterinarian_userId_idx`(`userId`),
    INDEX `veterinarian_verified_idx`(`verified`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `vet_ratings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `veterinarianId` INTEGER NOT NULL,
    `rating` INTEGER NOT NULL,
    `comment` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `vet_ratings_userId_idx`(`userId`),
    INDEX `vet_ratings_veterinarianId_idx`(`veterinarianId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `technicians` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `type` ENUM('ELECTRICIAN', 'MECHANIC') NOT NULL DEFAULT 'ELECTRICIAN',
    `experience` INTEGER NULL,
    `location` VARCHAR(191) NOT NULL,
    `latitude` DOUBLE NULL,
    `longitude` DOUBLE NULL,
    `availability` ENUM('AVAILABLE', 'UNAVAILABLE', 'BUSY') NOT NULL DEFAULT 'AVAILABLE',
    `info` VARCHAR(191) NULL,
    `imageUrl` VARCHAR(191) NULL,
    `averageRating` DOUBLE NULL DEFAULT 0,
    `ratingCount` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `technicians_userId_key`(`userId`),
    INDEX `technicians_latitude_longitude_idx`(`latitude`, `longitude`),
    INDEX `technicians_userId_idx`(`userId`),
    INDEX `technicians_type_idx`(`type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tech_ratings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `technicianId` INTEGER NOT NULL,
    `rating` INTEGER NOT NULL,
    `comment` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `tech_ratings_userId_idx`(`userId`),
    INDEX `tech_ratings_technicianId_idx`(`technicianId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `veterinarian` ADD CONSTRAINT `veterinarian_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `vet_ratings` ADD CONSTRAINT `vet_ratings_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `vet_ratings` ADD CONSTRAINT `vet_ratings_veterinarianId_fkey` FOREIGN KEY (`veterinarianId`) REFERENCES `veterinarian`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `technicians` ADD CONSTRAINT `technicians_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tech_ratings` ADD CONSTRAINT `tech_ratings_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tech_ratings` ADD CONSTRAINT `tech_ratings_technicianId_fkey` FOREIGN KEY (`technicianId`) REFERENCES `technicians`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
