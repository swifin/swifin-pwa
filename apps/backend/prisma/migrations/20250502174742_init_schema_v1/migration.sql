/*
  Warnings:

  - You are about to drop the column `feedback` on the `User` table. All the data in the column will be lost.
  - The `gender` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `birthday` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('male', 'female', 'other');

-- CreateEnum
CREATE TYPE "MemberType" AS ENUM ('individual', 'business', 'institution');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "feedback",
ADD COLUMN     "member_type" "MemberType",
ADD COLUMN     "tenant_id" TEXT,
DROP COLUMN "gender",
ADD COLUMN     "gender" "Gender",
DROP COLUMN "birthday",
ADD COLUMN     "birthday" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "Tenant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tenant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_slug_key" ON "Tenant"("slug");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE SET NULL ON UPDATE CASCADE;
