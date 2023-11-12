/*
  Warnings:

  - Made the column `remark` on table `system_dictionary_item_trans` required. This step will fail if there are existing NULL values in that column.
  - Made the column `remark` on table `system_dictionary_trans` required. This step will fail if there are existing NULL values in that column.
  - Made the column `content` on table `system_notification_trans` required. This step will fail if there are existing NULL values in that column.
  - Made the column `remark` on table `system_notification_trans` required. This step will fail if there are existing NULL values in that column.
  - Made the column `remark` on table `system_role_trans` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "system_dictionary_item_trans" ALTER COLUMN "remark" SET NOT NULL;

-- AlterTable
ALTER TABLE "system_dictionary_trans" ALTER COLUMN "remark" SET NOT NULL;

-- AlterTable
ALTER TABLE "system_notification_trans" ALTER COLUMN "content" SET NOT NULL,
ALTER COLUMN "remark" SET NOT NULL;

-- AlterTable
ALTER TABLE "system_role_trans" ALTER COLUMN "remark" SET NOT NULL;
