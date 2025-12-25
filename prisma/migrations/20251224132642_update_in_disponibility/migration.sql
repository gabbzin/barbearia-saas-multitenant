/*
  Warnings:

  - The `date` column on the `ExceptionDate` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `startTime` column on the `ExceptionDate` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `endTime` column on the `ExceptionDate` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `DisponibilityDefault` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "DisponibilityDefault" DROP CONSTRAINT "DisponibilityDefault_barberId_fkey";

-- AlterTable
ALTER TABLE "ExceptionDate" DROP COLUMN "date",
ADD COLUMN     "date" TIMESTAMPTZ,
DROP COLUMN "startTime",
ADD COLUMN     "startTime" TIMESTAMPTZ,
DROP COLUMN "endTime",
ADD COLUMN     "endTime" TIMESTAMPTZ;

-- DropTable
DROP TABLE "DisponibilityDefault";

-- CreateTable
CREATE TABLE "Disponibility" (
    "id" TEXT NOT NULL,
    "barberId" TEXT NOT NULL,
    "dia_semana" "DiaSemana"[],
    "startTime" TIMESTAMPTZ NOT NULL,
    "endTime" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "Disponibility_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Disponibility_barberId_key" ON "Disponibility"("barberId");

-- AddForeignKey
ALTER TABLE "Disponibility" ADD CONSTRAINT "Disponibility_barberId_fkey" FOREIGN KEY ("barberId") REFERENCES "Barber"("id") ON DELETE CASCADE ON UPDATE CASCADE;
