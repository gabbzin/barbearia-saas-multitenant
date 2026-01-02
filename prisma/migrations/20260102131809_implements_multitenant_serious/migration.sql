/*
  Warnings:

  - You are about to drop the `Barbershop` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId,tenantId]` on the table `Barber` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,tenantId]` on the table `subscription` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tenantId` to the `subscription` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Barber" DROP CONSTRAINT "Barber_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "Barber" DROP CONSTRAINT "Barber_userId_fkey";

-- DropForeignKey
ALTER TABLE "BarberService" DROP CONSTRAINT "BarberService_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_userId_fkey";

-- DropForeignKey
ALTER TABLE "Plan" DROP CONSTRAINT "Plan_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "UserTenant" DROP CONSTRAINT "UserTenant_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "UserTenant" DROP CONSTRAINT "UserTenant_userId_fkey";

-- DropForeignKey
ALTER TABLE "account" DROP CONSTRAINT "account_userId_fkey";

-- DropForeignKey
ALTER TABLE "session" DROP CONSTRAINT "session_userId_fkey";

-- DropForeignKey
ALTER TABLE "subscription" DROP CONSTRAINT "subscription_userId_fkey";

-- DropIndex
DROP INDEX "Barber_userId_key";

-- DropIndex
DROP INDEX "BarberService_barberId_idx";

-- DropIndex
DROP INDEX "Booking_userId_tenantId_date_status_idx";

-- DropIndex
DROP INDEX "subscription_userId_key";

-- AlterTable
ALTER TABLE "BarberService" ADD COLUMN     "durationInMinutes" INTEGER NOT NULL DEFAULT 30;

-- AlterTable
ALTER TABLE "UserTenant" ADD COLUMN     "stripeCustomerId" TEXT;

-- AlterTable
ALTER TABLE "subscription" ADD COLUMN     "tenantId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Barbershop";

-- DropTable
DROP TABLE "user";

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "passwordHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "barbershops" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "logo" TEXT NOT NULL DEFAULT 'https://3tlh7aktl6.ufs.sh/f/tcFRjMXVSkQ0Asb1IxZDwZ30bIph8P2qjXfOcVJmTvFtnMxi',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "barbershops_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "barbershops_slug_key" ON "barbershops"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Barber_userId_tenantId_key" ON "Barber"("userId", "tenantId");

-- CreateIndex
CREATE INDEX "BarberService_barberId_tenantId_idx" ON "BarberService"("barberId", "tenantId");

-- CreateIndex
CREATE INDEX "Booking_userId_tenantId_idx" ON "Booking"("userId", "tenantId");

-- CreateIndex
CREATE INDEX "Booking_barberId_date_idx" ON "Booking"("barberId", "date");

-- CreateIndex
CREATE INDEX "Booking_tenantId_date_idx" ON "Booking"("tenantId", "date");

-- CreateIndex
CREATE INDEX "UserTenant_tenantId_idx" ON "UserTenant"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_userId_tenantId_key" ON "subscription"("userId", "tenantId");

-- AddForeignKey
ALTER TABLE "UserTenant" ADD CONSTRAINT "UserTenant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTenant" ADD CONSTRAINT "UserTenant_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "barbershops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Barber" ADD CONSTRAINT "Barber_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Barber" ADD CONSTRAINT "Barber_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "barbershops"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BarberService" ADD CONSTRAINT "BarberService_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "barbershops"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_userId_tenantId_fkey" FOREIGN KEY ("userId", "tenantId") REFERENCES "UserTenant"("userId", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_userId_tenantId_fkey" FOREIGN KEY ("userId", "tenantId") REFERENCES "UserTenant"("userId", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Plan" ADD CONSTRAINT "Plan_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "barbershops"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
