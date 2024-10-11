/*
  Warnings:

  - Changed the type of `status` on the `Dictionary` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `status` on the `DictionaryItem` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Dictionary" DROP COLUMN "status",
ADD COLUMN     "status" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "DictionaryItem" DROP COLUMN "status",
ADD COLUMN     "status" BOOLEAN NOT NULL;
