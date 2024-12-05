-- DropIndex
DROP INDEX `cattle_latitude_longitude_idx` ON `cattle`;

-- DropIndex
DROP INDEX `farm_tools_latitude_longitude_idx` ON `farm_tools`;

-- DropIndex
DROP INDEX `harvest_latitude_longitude_idx` ON `harvest`;

-- DropIndex
DROP INDEX `technicians_latitude_longitude_idx` ON `technicians`;

-- DropIndex
DROP INDEX `transportation_latitude_longitude_idx` ON `transportation`;

-- DropIndex
DROP INDEX `veterinarian_latitude_longitude_idx` ON `veterinarian`;

-- CreateIndex
CREATE INDEX `cattle_latitude_longitude_updatedAt_idx` ON `cattle`(`latitude`, `longitude`, `updatedAt`);

-- CreateIndex
CREATE INDEX `cattle_updatedAt_idx` ON `cattle`(`updatedAt`);

-- CreateIndex
CREATE INDEX `farm_tools_latitude_longitude_updatedAt_idx` ON `farm_tools`(`latitude`, `longitude`, `updatedAt`);

-- CreateIndex
CREATE INDEX `harvest_latitude_longitude_updatedAt_idx` ON `harvest`(`latitude`, `longitude`, `updatedAt`);

-- CreateIndex
CREATE INDEX `myposts_userId_itemType_idx` ON `myposts`(`userId`, `itemType`);

-- CreateIndex
CREATE INDEX `technicians_latitude_longitude_updatedAt_idx` ON `technicians`(`latitude`, `longitude`, `updatedAt`);

-- CreateIndex
CREATE INDEX `transportation_latitude_longitude_updatedAt_idx` ON `transportation`(`latitude`, `longitude`, `updatedAt`);

-- CreateIndex
CREATE INDEX `veterinarian_latitude_longitude_updatedAt_idx` ON `veterinarian`(`latitude`, `longitude`, `updatedAt`);

-- CreateIndex
CREATE INDEX `wishlist_userId_itemType_idx` ON `wishlist`(`userId`, `itemType`);
