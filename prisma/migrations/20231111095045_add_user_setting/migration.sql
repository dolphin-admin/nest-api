/*
  Warnings:

  - You are about to drop the column `user_id` on the `system_setting` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "system_setting" DROP CONSTRAINT "system_setting_user_id_fkey";

-- DropIndex
DROP INDEX "system_setting_user_id_key";

-- AlterTable
ALTER TABLE "system_setting" DROP COLUMN "user_id";

-- CreateTable
CREATE TABLE "system_user_setting" (
    "id" SERIAL NOT NULL,
    "key" VARCHAR(100) NOT NULL,
    "value" VARCHAR(255),
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "built_in" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER DEFAULT 0,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMPTZ(3),
    "updated_by" INTEGER,
    "deleted_at" TIMESTAMPTZ(3),
    "deleted_by" INTEGER,

    CONSTRAINT "system_user_setting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_user_setting_trans" (
    "id" SERIAL NOT NULL,
    "lang" "Lang" NOT NULL,
    "label" VARCHAR(50) NOT NULL,
    "remark" VARCHAR(500),
    "user_setting_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMPTZ(3),
    "updated_by" INTEGER,
    "deleted_at" TIMESTAMPTZ(3),
    "deleted_by" INTEGER,

    CONSTRAINT "system_user_setting_trans_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "system_user_setting_key_key" ON "system_user_setting"("key");

-- CreateIndex
CREATE UNIQUE INDEX "system_user_setting_user_id_key" ON "system_user_setting"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "system_user_setting_trans_user_setting_id_lang_key" ON "system_user_setting_trans"("user_setting_id", "lang");

-- AddForeignKey
ALTER TABLE "system_user_setting" ADD CONSTRAINT "system_user_setting_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "system_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_user_setting_trans" ADD CONSTRAINT "system_user_setting_trans_user_setting_id_fkey" FOREIGN KEY ("user_setting_id") REFERENCES "system_user_setting"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
