/*
  Warnings:

  - Added the required column `passwordHash` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "swifinId" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "country" TEXT,
    "gender" TEXT,
    "memberType" TEXT,
    "profileConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("country", "createdAt", "email", "gender", "id", "memberType", "name", "profileConfirmed", "swifinId", "updatedAt") SELECT "country", "createdAt", "email", "gender", "id", "memberType", "name", "profileConfirmed", "swifinId", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_swifinId_key" ON "User"("swifinId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
