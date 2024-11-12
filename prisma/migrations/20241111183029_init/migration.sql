-- CreateTable
CREATE TABLE "Purchase" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "delivery_date" TIMESTAMP(3) NOT NULL,
    "supplier" TEXT NOT NULL,
    "product" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "Purchase_pkey" PRIMARY KEY ("id")
);
