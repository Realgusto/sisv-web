-- AlterTable
ALTER TABLE "Overview" ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Purchase" ADD COLUMN     "approval_user_id" TEXT;

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_approval_user_id_fkey" FOREIGN KEY ("approval_user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
