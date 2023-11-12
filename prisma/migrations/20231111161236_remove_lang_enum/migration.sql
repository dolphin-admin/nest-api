/*
  Warnings:

  - Changed the type of `lang` on the `system_dictionary_item_trans` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `lang` on the `system_dictionary_trans` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `lang` on the `system_notification_trans` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `lang` on the `system_position_trans` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `lang` on the `system_role_trans` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `lang` on the `system_setting_trans` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `remark` on table `system_setting_trans` required. This step will fail if there are existing NULL values in that column.
  - Changed the type of `lang` on the `system_user_setting_trans` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "system_dictionary_item_trans" DROP COLUMN "lang",
ADD COLUMN     "lang" VARCHAR(10) NOT NULL;

-- AlterTable
ALTER TABLE "system_dictionary_trans" DROP COLUMN "lang",
ADD COLUMN     "lang" VARCHAR(10) NOT NULL;

-- AlterTable
ALTER TABLE "system_notification_trans" DROP COLUMN "lang",
ADD COLUMN     "lang" VARCHAR(10) NOT NULL;

-- AlterTable
ALTER TABLE "system_position_trans" DROP COLUMN "lang",
ADD COLUMN     "lang" VARCHAR(10) NOT NULL;

-- AlterTable
ALTER TABLE "system_role_trans" DROP COLUMN "lang",
ADD COLUMN     "lang" VARCHAR(10) NOT NULL;

-- AlterTable
ALTER TABLE "system_setting_trans" DROP COLUMN "lang",
ADD COLUMN     "lang" VARCHAR(10) NOT NULL,
ALTER COLUMN "remark" SET NOT NULL;

-- AlterTable
ALTER TABLE "system_user_setting_trans" DROP COLUMN "lang",
ADD COLUMN     "lang" VARCHAR(10) NOT NULL;

-- DropEnum
DROP TYPE "Lang";

-- CreateIndex
CREATE UNIQUE INDEX "system_dictionary_item_trans_dictionary_Item_id_lang_key" ON "system_dictionary_item_trans"("dictionary_Item_id", "lang");

-- CreateIndex
CREATE UNIQUE INDEX "system_dictionary_trans_dictionary_id_lang_key" ON "system_dictionary_trans"("dictionary_id", "lang");

-- CreateIndex
CREATE UNIQUE INDEX "system_notification_trans_notification_id_lang_key" ON "system_notification_trans"("notification_id", "lang");

-- CreateIndex
CREATE UNIQUE INDEX "system_position_trans_position_id_lang_key" ON "system_position_trans"("position_id", "lang");

-- CreateIndex
CREATE UNIQUE INDEX "system_role_trans_role_id_lang_key" ON "system_role_trans"("role_id", "lang");

-- CreateIndex
CREATE UNIQUE INDEX "system_setting_trans_setting_id_lang_key" ON "system_setting_trans"("setting_id", "lang");

-- CreateIndex
CREATE UNIQUE INDEX "system_user_setting_trans_user_setting_id_lang_key" ON "system_user_setting_trans"("user_setting_id", "lang");
