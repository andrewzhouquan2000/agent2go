/*
  Warnings:

  - You are about to drop the column `displayName` on the `Integration` table. All the data in the column will be lost.
  - You are about to drop the column `lastSyncAt` on the `Integration` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Integration` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Integration` table. All the data in the column will be lost.
  - You are about to alter the column `credentials` on the `Integration` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.
  - You are about to alter the column `input` on the `Task` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.
  - You are about to alter the column `output` on the `Task` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.
  - Added the required column `type` to the `Integration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `periodEnd` to the `UserUsage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `periodStart` to the `UserUsage` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Integration" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "credentials" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Integration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Integration" ("createdAt", "credentials", "id", "updatedAt", "userId") SELECT "createdAt", "credentials", "id", "updatedAt", "userId" FROM "Integration";
DROP TABLE "Integration";
ALTER TABLE "new_Integration" RENAME TO "Integration";
CREATE INDEX "Integration_userId_idx" ON "Integration"("userId");
CREATE TABLE "new_Task" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "userId" TEXT NOT NULL,
    "agentId" TEXT,
    "teamId" TEXT,
    "scenarioId" TEXT,
    "result" TEXT,
    "crewaiFlowId" TEXT,
    "metadata" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "input" JSONB,
    "output" JSONB,
    "parentId" TEXT,
    "workflowId" TEXT,
    CONSTRAINT "Task_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "Scenario" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Task_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Task_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Task_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Task" ("agentId", "createdAt", "crewaiFlowId", "description", "id", "input", "metadata", "output", "parentId", "result", "scenarioId", "status", "teamId", "title", "updatedAt", "userId", "workflowId") SELECT "agentId", "createdAt", "crewaiFlowId", "description", "id", "input", "metadata", "output", "parentId", "result", "scenarioId", "status", "teamId", "title", "updatedAt", "userId", "workflowId" FROM "Task";
DROP TABLE "Task";
ALTER TABLE "new_Task" RENAME TO "Task";
CREATE TABLE "new_UserUsage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "periodStart" DATETIME NOT NULL,
    "periodEnd" DATETIME NOT NULL,
    "taskCount" INTEGER NOT NULL DEFAULT 0,
    "tokenCount" INTEGER NOT NULL DEFAULT 0,
    "costCents" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "UserUsage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_UserUsage" ("costCents", "createdAt", "date", "id", "taskCount", "tokenCount", "updatedAt", "userId") SELECT "costCents", "createdAt", "date", "id", "taskCount", "tokenCount", "updatedAt", "userId" FROM "UserUsage";
DROP TABLE "UserUsage";
ALTER TABLE "new_UserUsage" RENAME TO "UserUsage";
CREATE UNIQUE INDEX "UserUsage_userId_date_key" ON "UserUsage"("userId", "date");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
