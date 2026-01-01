/*
  Warnings:

  - The values [USER] on the enum `userRole` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `Disponibility` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `tenantId` to the `Barber` table without a default value. This is not possible if the table is not empty.
  - Made the column `userId` on table `Barber` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `tenantId` to the `BarberService` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenantId` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date` to the `ExceptionDate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `ExceptionDate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endTime` to the `ExceptionDate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenantId` to the `Plan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "userRole_new" AS ENUM ('CLIENT', 'BARBER', 'ADMIN');
ALTER TABLE "public"."user" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "user" ALTER COLUMN "role" TYPE "userRole_new" USING ("role"::text::"userRole_new");
ALTER TYPE "userRole" RENAME TO "userRole_old";
ALTER TYPE "userRole_new" RENAME TO "userRole";
DROP TYPE "public"."userRole_old";
ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'CLIENT';
COMMIT;

-- DropForeignKey
ALTER TABLE "Barber" DROP CONSTRAINT "Barber_userId_fkey";

-- DropForeignKey
ALTER TABLE "Disponibility" DROP CONSTRAINT "Disponibility_barberId_fkey";

-- DropIndex
DROP INDEX "Booking_barberId_date_idx";

-- DropIndex
DROP INDEX "Booking_status_idx";

-- DropIndex
DROP INDEX "Booking_userId_idx";

-- DropIndex
DROP INDEX "ExceptionDate_barberId_idx";

-- DropIndex
DROP INDEX "subscription_userId_idx";

-- AlterTable
ALTER TABLE "Barber" ADD COLUMN     "tenantId" TEXT NOT NULL,
ALTER COLUMN "phone" SET NOT NULL,
ALTER COLUMN "phone" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "BarberService" ADD COLUMN     "tenantId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "tenantId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ExceptionDate" DROP COLUMN "date",
ADD COLUMN     "date" DATE NOT NULL,
DROP COLUMN "startTime",
ADD COLUMN     "startTime" TIME NOT NULL,
DROP COLUMN "endTime",
ADD COLUMN     "endTime" TIME NOT NULL;

-- AlterTable
ALTER TABLE "Plan" ADD COLUMN     "tenantId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "tenantId" TEXT,
ALTER COLUMN "role" SET DEFAULT 'CLIENT';

-- DropTable
DROP TABLE "Disponibility";

-- DropEnum
DROP TYPE "DiaSemana";

-- CreateTable
CREATE TABLE "Barbershop" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "logo" TEXT NOT NULL DEFAULT 'https://3tlh7aktl6.ufs.sh/f/tcFRjMXVSkQ0Asb1IxZDwZ30bIph8P2qjXfOcVJmTvFtnMxi',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Barbershop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BarberDisponibility" (
    "id" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "barberId" TEXT NOT NULL,

    CONSTRAINT "BarberDisponibility_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BarberDisponibility_barberId_dayOfWeek_idx" ON "BarberDisponibility"("barberId", "dayOfWeek");

-- CreateIndex
CREATE UNIQUE INDEX "BarberDisponibility_barberId_dayOfWeek_startTime_endTime_key" ON "BarberDisponibility"("barberId", "dayOfWeek", "startTime", "endTime");

-- CreateIndex
CREATE INDEX "Booking_userId_tenantId_date_status_idx" ON "Booking"("userId", "tenantId", "date", "status");

-- CreateIndex
CREATE INDEX "ExceptionDate_barberId_date_idx" ON "ExceptionDate"("barberId", "date");

-- CreateIndex
CREATE INDEX "subscription_userId_planId_idx" ON "subscription"("userId", "planId");

-- AddForeignKey
ALTER TABLE "Barber" ADD CONSTRAINT "Barber_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Barber" ADD CONSTRAINT "Barber_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Barbershop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BarberService" ADD CONSTRAINT "BarberService_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Barbershop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Plan" ADD CONSTRAINT "Plan_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Barbershop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Barbershop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BarberDisponibility" ADD CONSTRAINT "BarberDisponibility_barberId_fkey" FOREIGN KEY ("barberId") REFERENCES "Barber"("id") ON DELETE CASCADE ON UPDATE CASCADE;
