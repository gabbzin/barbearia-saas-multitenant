/*
  Warnings:

  - You are about to drop the column `stripeCustomerId` on the `UserTenant` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserTenant" DROP COLUMN "stripeCustomerId";

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "stripeCustomerId" TEXT;
