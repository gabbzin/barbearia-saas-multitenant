/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `Barber` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Barber" DROP COLUMN "imageUrl";

-- AlterTable
ALTER TABLE "barbershops" ADD COLUMN     "timezone" TEXT NOT NULL DEFAULT 'America/Sao_Paulo';
