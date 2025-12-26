/*
  Warnings:

  - You are about to drop the column `dia_semana` on the `Disponibility` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Disponibility" DROP COLUMN "dia_semana",
ADD COLUMN     "daysOfWeek" INTEGER[];
