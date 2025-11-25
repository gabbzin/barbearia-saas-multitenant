/*
  Warnings:

  - Added the required column `stripeEventId` to the `UserSubscription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserSubscription" ADD COLUMN     "stripeChargeId" TEXT,
ADD COLUMN     "stripeEventId" TEXT NOT NULL;
