/*
  Warnings:

  - The values [Solicitada,Andamento,Aprovada,Devolvida] on the enum `Status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Status_new" AS ENUM ('Aberta', 'Recebida', 'Faturada', 'Cancelada', 'Pedido_atendido', 'Pedido_aberto', 'Pedido_aprovado', 'Pedido_rejeitado', 'Pedido_encerrado');
ALTER TABLE "Purchase" ALTER COLUMN "status" TYPE "Status_new" USING ("status"::text::"Status_new");
ALTER TYPE "Status" RENAME TO "Status_old";
ALTER TYPE "Status_new" RENAME TO "Status";
DROP TYPE "Status_old";
COMMIT;

-- AlterTable
ALTER TABLE "Purchase" ALTER COLUMN "status" DROP NOT NULL;
