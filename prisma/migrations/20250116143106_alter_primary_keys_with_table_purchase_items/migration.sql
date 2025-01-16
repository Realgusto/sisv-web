/*
  Warnings:

  - The primary key for the `PurchaseItems` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "PurchaseItems" DROP CONSTRAINT "PurchaseItems_pkey",
ADD CONSTRAINT "PurchaseItems_pkey" PRIMARY KEY ("id", "purchaseId");
