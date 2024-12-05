-- CreateTable
CREATE TABLE `wishlist` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `itemType` ENUM('Cattle', 'Tool', 'Harvest', 'TransPortation') NOT NULL,
    `itemId` INTEGER NOT NULL,

    INDEX `wishlist_userId_idx`(`userId`),
    INDEX `wishlist_itemId_idx`(`itemId`),
    INDEX `wishlist_itemType_idx`(`itemType`),
    INDEX `wishlist_userId_itemId_itemType_idx`(`userId`, `itemId`, `itemType`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `wishlist` ADD CONSTRAINT `wishlist_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
