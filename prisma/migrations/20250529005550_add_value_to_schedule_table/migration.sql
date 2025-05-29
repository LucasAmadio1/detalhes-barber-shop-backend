/*
  Warnings:

  - Added the required column `value` to the `schedules` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "schedules" ADD COLUMN     "value" TEXT NOT NULL;
