-- CreateTable
CREATE TABLE `myposts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `itemType` ENUM('CATTLE', 'TOOL', 'CROP') NOT NULL,
    `itemId` INTEGER NOT NULL,

    INDEX `myposts_userId_idx`(`userId`),
    INDEX `myposts_itemId_idx`(`itemId`),
    INDEX `myposts_itemType_idx`(`itemType`),
    INDEX `myposts_userId_itemId_itemType_idx`(`userId`, `itemId`, `itemType`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `myposts` ADD CONSTRAINT `myposts_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
