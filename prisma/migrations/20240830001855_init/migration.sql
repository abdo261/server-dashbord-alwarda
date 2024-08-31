-- DropForeignKey
ALTER TABLE `users` DROP FOREIGN KEY `Users_centreId_fkey`;

-- AlterTable
ALTER TABLE `users` MODIFY `centreId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Users` ADD CONSTRAINT `Users_centreId_fkey` FOREIGN KEY (`centreId`) REFERENCES `Centres`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
