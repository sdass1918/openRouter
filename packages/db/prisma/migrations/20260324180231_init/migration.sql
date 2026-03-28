-- AlterTable
ALTER TABLE "Apikeys" ADD COLUMN     "creditsConsumed" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lastUsed" TIMESTAMP(3);
