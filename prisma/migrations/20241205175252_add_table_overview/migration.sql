-- CreateTable
CREATE TABLE "Overview" (
    "id" TEXT NOT NULL,
    "salesMonthly" DOUBLE PRECISION NOT NULL,
    "averageTicket" DOUBLE PRECISION NOT NULL,
    "salesLastYear" JSONB[],
    "top5BestSeller" JSONB[],
    "activeCustomers" INTEGER NOT NULL,
    "inactiveCustomers" INTEGER NOT NULL,

    CONSTRAINT "Overview_pkey" PRIMARY KEY ("id")
);
