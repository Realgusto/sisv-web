/*
  Warnings:

  - The `status` column on the `Purchase` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "StatusPurchase" AS ENUM ('Aberta', 'Recebida', 'Autorizada', 'Faturada', 'Cancelada', 'Pedido_aberto', 'Pedido_aprovado', 'Pedido_rejeitado', 'Pedido_encerrado');

-- AlterTable
ALTER TABLE "Purchase" DROP COLUMN "status",
ADD COLUMN     "status" "StatusPurchase";

-- DropEnum
DROP TYPE "Status";
