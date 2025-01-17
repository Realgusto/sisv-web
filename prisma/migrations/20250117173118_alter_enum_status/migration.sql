/*
  Warnings:

  - The values [Pedido_atendido] on the enum `Status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Status_new" AS ENUM ('Aberta', 'Recebida', 'Autorizada', 'Faturada', 'Cancelada', 'Pedido_aberto', 'Pedido_aprovado', 'Pedido_rejeitado', 'Pedido_encerrado');
ALTER TABLE "Purchase" ALTER COLUMN "status" TYPE "Status_new" USING ("status"::text::"Status_new");
ALTER TYPE "Status" RENAME TO "Status_old";
ALTER TYPE "Status_new" RENAME TO "Status";
DROP TYPE "Status_old";
COMMIT;
