-- DropForeignKey
ALTER TABLE `students` DROP FOREIGN KEY `Students_centreId_fkey`;

-- AlterTable
ALTER TABLE `students` MODIFY `centreId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Students` ADD CONSTRAINT `Students_centreId_fkey` FOREIGN KEY (`centreId`) REFERENCES `Centres`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
