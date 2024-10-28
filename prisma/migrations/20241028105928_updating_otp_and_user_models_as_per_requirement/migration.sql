-- DropIndex
DROP INDEX `otps_phoneNumber_key` ON `otps`;

-- CreateIndex
CREATE INDEX `otps_createdAt_idx` ON `otps`(`createdAt`);
