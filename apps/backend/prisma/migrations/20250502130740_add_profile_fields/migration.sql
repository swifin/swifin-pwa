-- AlterTable
ALTER TABLE "User" ADD COLUMN     "feedback" TEXT,
ADD COLUMN     "name" TEXT,
ADD COLUMN     "profile_confirmed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "wallet_activated" BOOLEAN NOT NULL DEFAULT false;
