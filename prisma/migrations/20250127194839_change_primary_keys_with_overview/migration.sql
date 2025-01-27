/*
  Warnings:

  - The primary key for the `Overview` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Overview" DROP CONSTRAINT "Overview_pkey",
ADD CONSTRAINT "Overview_pkey" PRIMARY KEY ("id", "companyId");
