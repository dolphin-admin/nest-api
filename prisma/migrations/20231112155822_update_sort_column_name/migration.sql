/*
  Warnings:

  - You are about to drop the column `sort_order` on the `system_department` table. All the data in the column will be lost.
  - You are about to drop the column `sort_order` on the `system_dictionary` table. All the data in the column will be lost.
  - You are about to drop the column `sort_order` on the `system_dictionary_item` table. All the data in the column will be lost.
  - You are about to drop the column `sort_order` on the `system_menu_item` table. All the data in the column will be lost.
  - You are about to drop the column `sort_order` on the `system_position` table. All the data in the column will be lost.
  - You are about to drop the column `sort_order` on the `system_role` table. All the data in the column will be lost.
  - You are about to drop the column `sort_order` on the `system_setting` table. All the data in the column will be lost.
  - You are about to drop the column `sort_order` on the `system_user_setting` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "system_department" DROP COLUMN "sort_order",
ADD COLUMN     "sort" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "system_dictionary" DROP COLUMN "sort_order",
ADD COLUMN     "sort" INTEGER DEFAULT 0;

-- AlterTable
ALTER TABLE "system_dictionary_item" DROP COLUMN "sort_order",
ADD COLUMN     "sort" INTEGER DEFAULT 0;

-- AlterTable
ALTER TABLE "system_menu_item" DROP COLUMN "sort_order",
ADD COLUMN     "sort" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "system_position" DROP COLUMN "sort_order",
ADD COLUMN     "sort" INTEGER DEFAULT 0;

-- AlterTable
ALTER TABLE "system_role" DROP COLUMN "sort_order",
ADD COLUMN     "sort" INTEGER DEFAULT 0;

-- AlterTable
ALTER TABLE "system_setting" DROP COLUMN "sort_order",
ADD COLUMN     "sort" INTEGER DEFAULT 0;

-- AlterTable
ALTER TABLE "system_user_setting" DROP COLUMN "sort_order",
ADD COLUMN     "sort" INTEGER DEFAULT 0;
