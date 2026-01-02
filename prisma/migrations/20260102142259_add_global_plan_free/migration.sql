-- DropForeignKey
ALTER TABLE "Plan" DROP CONSTRAINT "Plan_tenantId_fkey";

-- AlterTable
ALTER TABLE "Plan" ALTER COLUMN "tenantId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Plan" ADD CONSTRAINT "Plan_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "barbershops"("id") ON DELETE SET NULL ON UPDATE CASCADE;
