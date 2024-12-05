/*
  Warnings:

  - You are about to drop the column `farmToolId` on the `tools_images` table. All the data in the column will be lost.
  - Added the required column `toolId` to the `tools_images` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `tools_images` DROP FOREIGN KEY `tools_images_farmToolId_fkey`;

-- AlterTable
ALTER TABLE `tools_images` DROP COLUMN `farmToolId`,
    ADD COLUMN `toolId` INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX `farm_tool_images_farmToolId_fkey` ON `tools_images`(`toolId`);

-- AddForeignKey
ALTER TABLE `tools_images` ADD CONSTRAINT `tools_images_toolId_fkey` FOREIGN KEY (`toolId`) REFERENCES `tools`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
