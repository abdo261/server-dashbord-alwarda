-- DropForeignKey
ALTER TABLE `payments` DROP FOREIGN KEY `Payments_studentId_fkey`;

-- AddForeignKey
ALTER TABLE `Payments` ADD CONSTRAINT `Payments_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Students`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
