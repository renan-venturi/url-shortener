/*
  Warnings:

  - A unique constraint covering the columns `[shortCode]` on the table `Url` will be added. If there are existing duplicate values, this will fail.
  - Made the column `shortCode` on table `Url` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Url" ALTER COLUMN "shortCode" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Url_shortCode_key" ON "Url"("shortCode");
