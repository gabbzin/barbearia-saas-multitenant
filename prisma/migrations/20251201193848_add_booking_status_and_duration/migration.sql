/*
  Warnings:

  - You are about to drop the column `cancelled` on the `Booking` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('SCHEDULED', 'COMPLETED', 'CANCELLED');

-- DropIndex
DROP INDEX "Booking_barberId_date_key";

-- DropIndex
DROP INDEX "Booking_barberId_idx";

-- DropIndex
DROP INDEX "Booking_date_idx";

-- DropIndex
DROP INDEX "Booking_serviceId_idx";

-- DropIndex
DROP INDEX "Booking_userSubscriptionId_idx";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "cancelled",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "status" "BookingStatus" NOT NULL DEFAULT 'SCHEDULED',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "Booking_barberId_date_idx" ON "Booking"("barberId", "date");

-- CreateIndex
CREATE INDEX "Booking_status_idx" ON "Booking"("status");
