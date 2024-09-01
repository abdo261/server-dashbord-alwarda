/*
  Warnings:

  - Added the required column `startAt` to the `Payments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `payments` ADD COLUMN `startAt` DATETIME(3) NOT NULL;
