/*
  Warnings:

  - The primary key for the `Apikeys` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Apikeys` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Companies` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Companies` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Conversations` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Conversations` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Model_provider_mapping` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Model_provider_mapping` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Models` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Models` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Providers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Providers` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `onRampTransaction` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `onRampTransaction` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `userId` on the `Apikeys` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `userId` on the `Conversations` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `api_key_id` on the `Conversations` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `model_provider_mapping_id` on the `Conversations` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `modelId` on the `Model_provider_mapping` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `providerId` on the `Model_provider_mapping` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `company_id` on the `Models` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `userId` on the `onRampTransaction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Apikeys" DROP CONSTRAINT "Apikeys_userId_fkey";

-- DropForeignKey
ALTER TABLE "Conversations" DROP CONSTRAINT "Conversations_api_key_id_fkey";

-- DropForeignKey
ALTER TABLE "Conversations" DROP CONSTRAINT "Conversations_model_provider_mapping_id_fkey";

-- DropForeignKey
ALTER TABLE "Conversations" DROP CONSTRAINT "Conversations_userId_fkey";

-- DropForeignKey
ALTER TABLE "Model_provider_mapping" DROP CONSTRAINT "Model_provider_mapping_modelId_fkey";

-- DropForeignKey
ALTER TABLE "Model_provider_mapping" DROP CONSTRAINT "Model_provider_mapping_providerId_fkey";

-- DropForeignKey
ALTER TABLE "Models" DROP CONSTRAINT "Models_company_id_fkey";

-- DropForeignKey
ALTER TABLE "onRampTransaction" DROP CONSTRAINT "onRampTransaction_userId_fkey";

-- AlterTable
ALTER TABLE "Apikeys" DROP CONSTRAINT "Apikeys_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
DROP COLUMN "userId",
ADD COLUMN     "userId" UUID NOT NULL,
ADD CONSTRAINT "Apikeys_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Companies" DROP CONSTRAINT "Companies_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "Companies_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Conversations" DROP CONSTRAINT "Conversations_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
DROP COLUMN "userId",
ADD COLUMN     "userId" UUID NOT NULL,
DROP COLUMN "api_key_id",
ADD COLUMN     "api_key_id" UUID NOT NULL,
DROP COLUMN "model_provider_mapping_id",
ADD COLUMN     "model_provider_mapping_id" UUID NOT NULL,
ADD CONSTRAINT "Conversations_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Model_provider_mapping" DROP CONSTRAINT "Model_provider_mapping_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
DROP COLUMN "modelId",
ADD COLUMN     "modelId" UUID NOT NULL,
DROP COLUMN "providerId",
ADD COLUMN     "providerId" UUID NOT NULL,
ADD CONSTRAINT "Model_provider_mapping_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Models" DROP CONSTRAINT "Models_pkey",
ADD COLUMN     "acitve" BOOLEAN NOT NULL DEFAULT true,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
DROP COLUMN "company_id",
ADD COLUMN     "company_id" UUID NOT NULL,
ADD CONSTRAINT "Models_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Providers" DROP CONSTRAINT "Providers_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "Providers_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "onRampTransaction" DROP CONSTRAINT "onRampTransaction_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
DROP COLUMN "userId",
ADD COLUMN     "userId" UUID NOT NULL,
ADD CONSTRAINT "onRampTransaction_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Model_provider_mapping_modelId_providerId_key" ON "Model_provider_mapping"("modelId", "providerId");

-- AddForeignKey
ALTER TABLE "Apikeys" ADD CONSTRAINT "Apikeys_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Models" ADD CONSTRAINT "Models_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Model_provider_mapping" ADD CONSTRAINT "Model_provider_mapping_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Models"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Model_provider_mapping" ADD CONSTRAINT "Model_provider_mapping_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Providers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "onRampTransaction" ADD CONSTRAINT "onRampTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversations" ADD CONSTRAINT "Conversations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversations" ADD CONSTRAINT "Conversations_api_key_id_fkey" FOREIGN KEY ("api_key_id") REFERENCES "Apikeys"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversations" ADD CONSTRAINT "Conversations_model_provider_mapping_id_fkey" FOREIGN KEY ("model_provider_mapping_id") REFERENCES "Model_provider_mapping"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
