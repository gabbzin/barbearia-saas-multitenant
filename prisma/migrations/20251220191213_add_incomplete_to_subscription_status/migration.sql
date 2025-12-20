/*
  Warnings:

  - The `status` column on the `subscription` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterEnum
ALTER TYPE "SubscriptionStatus" ADD VALUE 'INCOMPLETE';

-- DropForeignKey
ALTER TABLE "subscription" DROP CONSTRAINT "subscription_planId_fkey";

-- DropIndex
DROP INDEX "subscription_stripeCustomerId_key";

-- DropIndex
DROP INDEX "user_stripeCustomerId_key";

-- AlterTable
ALTER TABLE "subscription" ALTER COLUMN "planId" DROP NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "SubscriptionStatus";

-- DropEnum
DROP TYPE "SubscriptionStatusType";

-- AddForeignKey
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE SET NULL ON UPDATE CASCADE;
