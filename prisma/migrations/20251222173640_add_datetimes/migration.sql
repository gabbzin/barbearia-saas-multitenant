-- CreateEnum
CREATE TYPE "DiaSemana" AS ENUM ('SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY');

-- CreateTable
CREATE TABLE "DisponibilityDefault" (
    "id" TEXT NOT NULL,
    "barberId" TEXT NOT NULL,
    "dia_semana" "DiaSemana" NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,

    CONSTRAINT "DisponibilityDefault_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExceptionDate" (
    "id" TEXT NOT NULL,
    "barberId" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "isClosed" BOOLEAN NOT NULL DEFAULT true,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,

    CONSTRAINT "ExceptionDate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DisponibilityDefault_barberId_dia_semana_key" ON "DisponibilityDefault"("barberId", "dia_semana");

-- CreateIndex
CREATE INDEX "ExceptionDate_barberId_idx" ON "ExceptionDate"("barberId");

-- AddForeignKey
ALTER TABLE "DisponibilityDefault" ADD CONSTRAINT "DisponibilityDefault_barberId_fkey" FOREIGN KEY ("barberId") REFERENCES "Barber"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExceptionDate" ADD CONSTRAINT "ExceptionDate_barberId_fkey" FOREIGN KEY ("barberId") REFERENCES "Barber"("id") ON DELETE CASCADE ON UPDATE CASCADE;
