/*
  Warnings:

  - The values [boy,girl] on the enum `Teachers_sex` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[color]` on the table `Centres` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `students` MODIFY `sex` ENUM('HOMME', 'FEMME') NOT NULL;

-- AlterTable
ALTER TABLE `subjects` ADD COLUMN `teacherId` INTEGER NULL;

-- CreateTable
CREATE TABLE `Teachers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `sex` ENUM('HOMME', 'FEMME') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Centres_color_key` ON `Centres`(`color`);

-- AddForeignKey
ALTER TABLE `Subjects` ADD CONSTRAINT `Subjects_teacherId_fkey` FOREIGN KEY (`teacherId`) REFERENCES `Teachers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
