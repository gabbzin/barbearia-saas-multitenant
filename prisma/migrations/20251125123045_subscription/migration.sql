/*
  Warnings:

  - You are about to drop the column `activeUserId` on the `UserSubscription` table. All the data in the column will be lost.
  - You are about to drop the column `cancelledAt` on the `UserSubscription` table. All the data in the column will be lost.
  - You are about to drop the column `historyUserId` on the `UserSubscription` table. All the data in the column will be lost.
  - You are about to drop the column `subscriptionId` on the `UserSubscription` table. All the data in the column will be lost.
  - You are about to drop the `Subscription` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId]` on the table `UserSubscription` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `planId` to the `UserSubscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `UserSubscription` table without a default value. This is not possible if the table is not empty.
  - Made the column `stripeSubscriptionId` on table `UserSubscription` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "UserSubscription" DROP CONSTRAINT "UserSubscription_activeUserId_fkey";

-- DropForeignKey
ALTER TABLE "UserSubscription" DROP CONSTRAINT "UserSubscription_historyUserId_fkey";

-- DropForeignKey
ALTER TABLE "UserSubscription" DROP CONSTRAINT "UserSubscription_subscriptionId_fkey";

-- DropIndex
DROP INDEX "UserSubscription_activeUserId_idx";

-- DropIndex
DROP INDEX "UserSubscription_activeUserId_key";

-- DropIndex
DROP INDEX "UserSubscription_historyUserId_idx";

-- DropIndex
DROP INDEX "UserSubscription_status_idx";

-- DropIndex
DROP INDEX "UserSubscription_subscriptionId_idx";

-- AlterTable
ALTER TABLE "UserSubscription" DROP COLUMN "activeUserId",
DROP COLUMN "cancelledAt",
DROP COLUMN "historyUserId",
DROP COLUMN "subscriptionId",
ADD COLUMN     "planId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "stripeSubscriptionId" SET NOT NULL;

-- DropTable
DROP TABLE "Subscription";

-- CreateTable
CREATE TABLE "SubscriptionPlan" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "priceInCents" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubscriptionPlan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserSubscription_userId_key" ON "UserSubscription"("userId");

-- AddForeignKey
ALTER TABLE "UserSubscription" ADD CONSTRAINT "UserSubscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSubscription" ADD CONSTRAINT "UserSubscription_planId_fkey" FOREIGN KEY ("planId") REFERENCES "SubscriptionPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
