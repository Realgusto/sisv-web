-- CreateEnum
CREATE TYPE "StatusService" AS ENUM ('Aberta', 'Programada', 'Em_andamento', 'Concluida', 'Concluida_parcialmente', 'Cancelada');

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "service_user_id" TEXT,
    "approval_user_id" TEXT,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_date" TIMESTAMP(3),
    "department" TEXT,
    "equipment" TEXT,
    "criticality" TEXT,
    "service_type" TEXT,
    "equipment_status" TEXT,
    "service_description" TEXT,
    "observations" TEXT,
    "status" "StatusService" NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_service_user_id_fkey" FOREIGN KEY ("service_user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_approval_user_id_fkey" FOREIGN KEY ("approval_user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
