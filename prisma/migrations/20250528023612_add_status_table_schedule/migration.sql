-- CreateEnum
CREATE TYPE "ScheduleStatus" AS ENUM ('SCHEDULED', 'COMPLETED', 'CANCELED');

-- AlterTable
ALTER TABLE "schedules" ADD COLUMN     "status" "ScheduleStatus" NOT NULL DEFAULT 'SCHEDULED';
