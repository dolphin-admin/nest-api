/*
  Warnings:

  - You are about to drop the column `key` on the `system_dictionary_item` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "system_dictionary_item_key_key";

-- AlterTable
ALTER TABLE "system_dictionary_item" DROP COLUMN "key";
