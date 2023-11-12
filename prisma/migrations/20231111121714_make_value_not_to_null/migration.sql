/*
  Warnings:

  - Made the column `value` on table `system_setting` required. This step will fail if there are existing NULL values in that column.
  - Made the column `value` on table `system_user_setting` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "system_setting" ALTER COLUMN "value" SET NOT NULL;

-- AlterTable
ALTER TABLE "system_user_setting" ALTER COLUMN "value" SET NOT NULL;
