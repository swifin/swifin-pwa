-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "swifinId" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "country" TEXT,
    "gender" TEXT,
    "memberType" TEXT,
    "profileConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_swifinId_key" ON "User"("swifinId");
