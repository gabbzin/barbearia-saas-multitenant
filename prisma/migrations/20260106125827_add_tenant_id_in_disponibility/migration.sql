/*
  Warnings:

  - Added the required column `tenantId` to the `BarberDisponibility` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Plan_stripePriceId_key";

-- DropIndex
DROP INDEX "Plan_tenantId_stripePriceId_idx";

-- AlterTable
ALTER TABLE "BarberDisponibility" ADD COLUMN     "tenantId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Plan_tenantId_idx" ON "Plan"("tenantId");

-- AddForeignKey
ALTER TABLE "BarberDisponibility" ADD CONSTRAINT "BarberDisponibility_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "barbershops"("id") ON DELETE CASCADE ON UPDATE CASCADE;
