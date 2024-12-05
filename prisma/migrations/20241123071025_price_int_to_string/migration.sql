-- AlterTable
ALTER TABLE `farm_tools` MODIFY `price` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `harvest` MODIFY `type` ENUM('Vegetables', 'Fruits', 'Spices', 'Plants', 'Seeds', 'Manure', 'Grass', 'Crops', 'Others') NOT NULL;
