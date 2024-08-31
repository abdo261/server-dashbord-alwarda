-- DropForeignKey
ALTER TABLE `students` DROP FOREIGN KEY `Students_levelId_fkey`;

-- DropForeignKey
ALTER TABLE `subjects` DROP FOREIGN KEY `Subjects_levelId_fkey`;

-- AlterTable
ALTER TABLE `students` MODIFY `levelId` INTEGER NULL;

-- AlterTable
ALTER TABLE `subjects` MODIFY `levelId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Students` ADD CONSTRAINT `Students_levelId_fkey` FOREIGN KEY (`levelId`) REFERENCES `Levels`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Subjects` ADD CONSTRAINT `Subjects_levelId_fkey` FOREIGN KEY (`levelId`) REFERENCES `Levels`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
