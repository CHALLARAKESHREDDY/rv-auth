/*
  Warnings:

  - A unique constraint covering the columns `[userId,itemId,itemType]` on the table `myposts` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email,phoneNumber]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,itemId,itemType]` on the table `wishlist` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `myposts_userId_itemId_itemType_idx` ON `myposts`;

-- DropIndex
DROP INDEX `users_email_phoneNumber_idx` ON `users`;

-- DropIndex
DROP INDEX `wishlist_userId_itemId_itemType_idx` ON `wishlist`;

-- CreateIndex
CREATE UNIQUE INDEX `myposts_userId_itemId_itemType_key` ON `myposts`(`userId`, `itemId`, `itemType`);

-- CreateIndex
CREATE UNIQUE INDEX `users_email_phoneNumber_key` ON `users`(`email`, `phoneNumber`);

-- CreateIndex
CREATE UNIQUE INDEX `wishlist_userId_itemId_itemType_key` ON `wishlist`(`userId`, `itemId`, `itemType`);
