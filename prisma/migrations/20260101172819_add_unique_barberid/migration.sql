/*
  Warnings:

  - A unique constraint covering the columns `[barberId,date]` on the table `ExceptionDate` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `startTime` on the `BarberDisponibility` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `endTime` on the `BarberDisponibility` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `tenantId` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "BarberDisponibility" DROP COLUMN "startTime",
ADD COLUMN     "startTime" TIME NOT NULL,
DROP COLUMN "endTime",
ADD COLUMN     "endTime" TIME NOT NULL;

-- AlterTable
ALTER TABLE "ExceptionDate" ALTER COLUMN "startTime" DROP NOT NULL,
ALTER COLUMN "endTime" DROP NOT NULL;

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "tenantId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "BarberDisponibility_barberId_dayOfWeek_startTime_endTime_key" ON "BarberDisponibility"("barberId", "dayOfWeek", "startTime", "endTime");

-- CreateIndex
CREATE UNIQUE INDEX "ExceptionDate_barberId_date_key" ON "ExceptionDate"("barberId", "date");
