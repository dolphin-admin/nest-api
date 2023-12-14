/*
  Warnings:

  - Made the column `value` on table `system_dictionary_item` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "system_dictionary_item" ALTER COLUMN "value" SET NOT NULL;
