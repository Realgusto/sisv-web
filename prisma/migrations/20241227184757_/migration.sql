/*
  Warnings:

  - Added the required column `expenses` to the `Overview` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shopping` to the `Overview` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Overview" ADD COLUMN     "expenses" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "shopping" DOUBLE PRECISION NOT NULL;
