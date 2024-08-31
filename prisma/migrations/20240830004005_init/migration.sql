-- DropForeignKey
ALTER TABLE `students` DROP FOREIGN KEY `Students_registredBy_fkey`;

-- AlterTable
ALTER TABLE `students` MODIFY `registredBy` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Students` ADD CONSTRAINT `Students_registredBy_fkey` FOREIGN KEY (`registredBy`) REFERENCES `Users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
