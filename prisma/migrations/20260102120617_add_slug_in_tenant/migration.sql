/*
  Warnings:

  - A unique constraint covering the columns `[barberId,dayOfWeek]` on the table `BarberDisponibility` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `Barbershop` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Barbershop` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "BarberDisponibility_barberId_dayOfWeek_startTime_endTime_key";

-- AlterTable
ALTER TABLE "Barbershop" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "BarberDisponibility_barberId_dayOfWeek_key" ON "BarberDisponibility"("barberId", "dayOfWeek");

-- CreateIndex
CREATE UNIQUE INDEX "Barbershop_slug_key" ON "Barbershop"("slug");
