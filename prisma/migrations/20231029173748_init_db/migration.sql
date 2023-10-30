-- CreateEnum
CREATE TYPE "AuthType" AS ENUM ('USERNAME', 'PHONE_NUMBER', 'EMAIL', 'GITHUB', 'GOOGLE', 'WECHAT', 'ALIPAY');

-- CreateEnum
CREATE TYPE "MenuItemType" AS ENUM ('DIR', 'MENU', 'LINK', 'BUTTON');

-- CreateEnum
CREATE TYPE "Lang" AS ENUM ('zh_CN', 'en_US');

-- CreateTable
CREATE TABLE "system_user" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(30) NOT NULL,
    "nick_name" VARCHAR(50),
    "password" VARCHAR(100),
    "email" VARCHAR(50),
    "phone_number" VARCHAR(25),
    "first_name" VARCHAR(10),
    "middle_name" VARCHAR(10),
    "last_name" VARCHAR(10),
    "avatar_url" VARCHAR(100),
    "gender" VARCHAR(100),
    "country" VARCHAR(25),
    "province" VARCHAR(25),
    "city" VARCHAR(25),
    "address" VARCHAR(100),
    "biography" VARCHAR(500),
    "website" VARCHAR(50),
    "profile" VARCHAR(50),
    "birth_date" DATE,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "built_in" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMPTZ(3),
    "updated_by" INTEGER,
    "deleted_at" TIMESTAMPTZ(3),
    "deleted_by" INTEGER,

    CONSTRAINT "system_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_auth" (
    "id" SERIAL NOT NULL,
    "auth_type" "AuthType" NOT NULL,
    "open_id" VARCHAR(50) NOT NULL,
    "token" VARCHAR(255),
    "data" JSON,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMPTZ(3),
    "updated_by" INTEGER,
    "deleted_at" TIMESTAMPTZ(3),
    "deleted_by" INTEGER,

    CONSTRAINT "system_auth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_role" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "built_in" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER DEFAULT 0,
    "created_at" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMPTZ(3),
    "updated_by" INTEGER,
    "deleted_at" TIMESTAMPTZ(3),
    "deleted_by" INTEGER,

    CONSTRAINT "system_role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_role_trans" (
    "id" SERIAL NOT NULL,
    "lang" "Lang" NOT NULL,
    "label" VARCHAR(50) NOT NULL,
    "remark" VARCHAR(500),
    "role_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMPTZ(3),
    "updated_by" INTEGER,
    "deleted_at" TIMESTAMPTZ(3),
    "deleted_by" INTEGER,

    CONSTRAINT "system_role_trans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_user_role" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "role_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMPTZ(3),
    "updated_by" INTEGER,
    "deleted_at" TIMESTAMPTZ(3),
    "deleted_by" INTEGER,

    CONSTRAINT "system_user_role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_menu_item" (
    "id" SERIAL NOT NULL,
    "type" "MenuItemType" NOT NULL,
    "path" VARCHAR(255),
    "icon" VARCHAR(50),
    "component_path" VARCHAR(255),
    "code" VARCHAR(255),
    "hidden" BOOLEAN NOT NULL DEFAULT false,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "built_in" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "parent_id" INTEGER,
    "created_at" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMPTZ(3),
    "updated_by" INTEGER,
    "deleted_at" TIMESTAMPTZ(3),
    "deleted_by" INTEGER,

    CONSTRAINT "system_menu_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_menu_item_trans" (
    "id" SERIAL NOT NULL,
    "lang" TEXT NOT NULL,
    "label" VARCHAR(50),
    "remark" VARCHAR(500),
    "menu_item_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMPTZ(3),
    "updated_by" INTEGER,
    "deleted_at" TIMESTAMPTZ(3),
    "deleted_by" INTEGER,

    CONSTRAINT "system_menu_item_trans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_role_menu_item" (
    "id" SERIAL NOT NULL,
    "roleId" INTEGER NOT NULL,
    "menu_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMPTZ(3),
    "updated_by" INTEGER,
    "deleted_at" TIMESTAMPTZ(3),
    "deleted_by" INTEGER,

    CONSTRAINT "system_role_menu_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_department" (
    "id" SERIAL NOT NULL,
    "leader" VARCHAR(50),
    "phone_number" VARCHAR(20),
    "email" VARCHAR(50),
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "built_in" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "parent_Ids" INTEGER[],
    "parent_id" INTEGER,
    "created_at" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMPTZ(3),
    "updated_by" INTEGER,
    "deleted_at" TIMESTAMPTZ(3),
    "deleted_by" INTEGER,

    CONSTRAINT "system_department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_department_trans" (
    "id" SERIAL NOT NULL,
    "lang" TEXT NOT NULL,
    "label" VARCHAR(50),
    "remark" VARCHAR(500),
    "department_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMPTZ(3),
    "updated_by" INTEGER,
    "deleted_at" TIMESTAMPTZ(3),
    "deleted_by" INTEGER,

    CONSTRAINT "system_department_trans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_role_department" (
    "id" SERIAL NOT NULL,
    "roleId" INTEGER NOT NULL,
    "department_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMPTZ(3),
    "updated_by" INTEGER,
    "deleted_at" TIMESTAMPTZ(3),
    "deleted_by" INTEGER,

    CONSTRAINT "system_role_department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_position" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "built_in" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER DEFAULT 0,
    "created_at" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMPTZ(3),
    "updated_by" INTEGER,
    "deleted_at" TIMESTAMPTZ(3),
    "deleted_by" INTEGER,

    CONSTRAINT "system_position_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_position_trans" (
    "id" SERIAL NOT NULL,
    "lang" "Lang" NOT NULL,
    "label" VARCHAR(50) NOT NULL,
    "remark" VARCHAR(500),
    "position_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMPTZ(3),
    "updated_by" INTEGER,
    "deleted_at" TIMESTAMPTZ(3),
    "deleted_by" INTEGER,

    CONSTRAINT "system_position_trans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_user_position" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "position_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMPTZ(3),
    "updated_by" INTEGER,
    "deleted_at" TIMESTAMPTZ(3),
    "deleted_by" INTEGER,

    CONSTRAINT "system_user_position_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_setting" (
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

    CONSTRAINT "system_setting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_setting_trans" (
    "id" SERIAL NOT NULL,
    "lang" "Lang" NOT NULL,
    "label" VARCHAR(50) NOT NULL,
    "remark" VARCHAR(500),
    "setting_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMPTZ(3),
    "updated_by" INTEGER,
    "deleted_at" TIMESTAMPTZ(3),
    "deleted_by" INTEGER,

    CONSTRAINT "system_setting_trans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_dictionary" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "built_in" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER DEFAULT 0,
    "created_at" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMPTZ(3),
    "updated_by" INTEGER,
    "deleted_at" TIMESTAMPTZ(3),
    "deleted_by" INTEGER,

    CONSTRAINT "system_dictionary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_dictionary_trans" (
    "id" SERIAL NOT NULL,
    "lang" "Lang" NOT NULL,
    "label" VARCHAR(50) NOT NULL,
    "remark" VARCHAR(500),
    "dictionary_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMPTZ(3),
    "updated_by" INTEGER,
    "deleted_at" TIMESTAMPTZ(3),
    "deleted_by" INTEGER,

    CONSTRAINT "system_dictionary_trans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_dictionary_item" (
    "id" SERIAL NOT NULL,
    "key" VARCHAR(100) NOT NULL,
    "value" VARCHAR(255),
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "built_in" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER DEFAULT 0,
    "dictionary_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMPTZ(3),
    "updated_by" INTEGER,
    "deleted_at" TIMESTAMPTZ(3),
    "deleted_by" INTEGER,

    CONSTRAINT "system_dictionary_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_dictionary_item_trans" (
    "id" SERIAL NOT NULL,
    "lang" "Lang" NOT NULL,
    "label" VARCHAR(50) NOT NULL,
    "remark" VARCHAR(500),
    "dictionary_Item_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMPTZ(3),
    "updated_by" INTEGER,
    "deleted_at" TIMESTAMPTZ(3),
    "deleted_by" INTEGER,

    CONSTRAINT "system_dictionary_item_trans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_notification" (
    "id" SERIAL NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMPTZ(3),
    "updated_by" INTEGER,
    "deleted_at" TIMESTAMPTZ(3),
    "deleted_by" INTEGER,

    CONSTRAINT "system_notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_notification_trans" (
    "id" SERIAL NOT NULL,
    "lang" "Lang" NOT NULL,
    "title" VARCHAR(50) NOT NULL,
    "content" VARCHAR(500),
    "remark" VARCHAR(500),
    "notification_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMPTZ(3),
    "updated_by" INTEGER,
    "deleted_at" TIMESTAMPTZ(3),
    "deleted_by" INTEGER,

    CONSTRAINT "system_notification_trans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_user_traffic" (
    "id" SERIAL NOT NULL,
    "app" VARCHAR(25),
    "version" VARCHAR(25),
    "env" VARCHAR(25),
    "source" VARCHAR(25),
    "user_agent" VARCHAR(1000),
    "ip" VARCHAR(25),
    "area" VARCHAR(100),
    "longitude" DOUBLE PRECISION,
    "latitude" DOUBLE PRECISION,
    "altitude" DOUBLE PRECISION,
    "enter_at" TIMESTAMPTZ(3),
    "leave_at" TIMESTAMPTZ(3),
    "duration" INTEGER,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMPTZ(3),
    "updated_by" INTEGER,
    "deleted_at" TIMESTAMPTZ(3),
    "deleted_by" INTEGER,

    CONSTRAINT "system_user_traffic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_user_traffic_record" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(50),
    "url" VARCHAR(255),
    "path" VARCHAR(255),
    "enter_at" TIMESTAMPTZ(3),
    "leave_at" TIMESTAMPTZ(3),
    "duration" INTEGER,
    "user_traffic_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMPTZ(3),
    "updated_by" INTEGER,
    "deleted_at" TIMESTAMPTZ(3),
    "deleted_by" INTEGER,

    CONSTRAINT "system_user_traffic_record_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_login_log" (
    "id" SERIAL NOT NULL,
    "ip" VARCHAR(25) NOT NULL,
    "type" "AuthType" NOT NULL,
    "area" VARCHAR(100),
    "source" VARCHAR(25),
    "user_agent" VARCHAR(1000),
    "message" VARCHAR(255),
    "is_success" BOOLEAN NOT NULL DEFAULT true,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMPTZ(3),
    "updated_by" INTEGER,
    "deleted_at" TIMESTAMPTZ(3),
    "deleted_by" INTEGER,

    CONSTRAINT "system_login_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_operation_log" (
    "id" SERIAL NOT NULL,
    "moduleName" VARCHAR(25),
    "type" VARCHAR(25),
    "method" VARCHAR(100),
    "request_method" VARCHAR(25),
    "request_url" VARCHAR(255),
    "request_queries" JSONB,
    "request_params" JSONB,
    "request_body" JSONB,
    "response_body" JSONB,
    "response_status_code" INTEGER,
    "response_code" VARCHAR(10),
    "error_message" VARCHAR(255),
    "duration" INTEGER,
    "ip" VARCHAR(25) NOT NULL,
    "area" VARCHAR(100),
    "source" VARCHAR(25),
    "user_agent" VARCHAR(1000),
    "message" VARCHAR(255),
    "is_success" BOOLEAN NOT NULL DEFAULT true,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMPTZ(3),
    "updated_by" INTEGER,
    "deleted_at" TIMESTAMPTZ(3),
    "deleted_by" INTEGER,

    CONSTRAINT "system_operation_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "system_user_username_key" ON "system_user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "system_user_email_key" ON "system_user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "system_auth_auth_type_open_id_key" ON "system_auth"("auth_type", "open_id");

-- CreateIndex
CREATE UNIQUE INDEX "system_role_code_key" ON "system_role"("code");

-- CreateIndex
CREATE UNIQUE INDEX "system_role_trans_role_id_lang_key" ON "system_role_trans"("role_id", "lang");

-- CreateIndex
CREATE UNIQUE INDEX "system_menu_item_trans_menu_item_id_lang_key" ON "system_menu_item_trans"("menu_item_id", "lang");

-- CreateIndex
CREATE UNIQUE INDEX "system_position_code_key" ON "system_position"("code");

-- CreateIndex
CREATE UNIQUE INDEX "system_position_trans_position_id_lang_key" ON "system_position_trans"("position_id", "lang");

-- CreateIndex
CREATE UNIQUE INDEX "system_setting_key_key" ON "system_setting"("key");

-- CreateIndex
CREATE UNIQUE INDEX "system_setting_user_id_key" ON "system_setting"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "system_setting_trans_setting_id_lang_key" ON "system_setting_trans"("setting_id", "lang");

-- CreateIndex
CREATE UNIQUE INDEX "system_dictionary_code_key" ON "system_dictionary"("code");

-- CreateIndex
CREATE UNIQUE INDEX "system_dictionary_trans_dictionary_id_lang_key" ON "system_dictionary_trans"("dictionary_id", "lang");

-- CreateIndex
CREATE UNIQUE INDEX "system_dictionary_item_key_key" ON "system_dictionary_item"("key");

-- CreateIndex
CREATE UNIQUE INDEX "system_dictionary_item_trans_dictionary_Item_id_lang_key" ON "system_dictionary_item_trans"("dictionary_Item_id", "lang");

-- CreateIndex
CREATE UNIQUE INDEX "system_notification_trans_notification_id_lang_key" ON "system_notification_trans"("notification_id", "lang");

-- AddForeignKey
ALTER TABLE "system_auth" ADD CONSTRAINT "system_auth_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "system_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_role_trans" ADD CONSTRAINT "system_role_trans_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "system_role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_user_role" ADD CONSTRAINT "system_user_role_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "system_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_user_role" ADD CONSTRAINT "system_user_role_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "system_role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_menu_item" ADD CONSTRAINT "system_menu_item_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "system_menu_item"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_menu_item_trans" ADD CONSTRAINT "system_menu_item_trans_menu_item_id_fkey" FOREIGN KEY ("menu_item_id") REFERENCES "system_menu_item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_role_menu_item" ADD CONSTRAINT "system_role_menu_item_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "system_role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_role_menu_item" ADD CONSTRAINT "system_role_menu_item_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "system_menu_item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_department" ADD CONSTRAINT "system_department_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "system_department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_department_trans" ADD CONSTRAINT "system_department_trans_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "system_department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_role_department" ADD CONSTRAINT "system_role_department_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "system_role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_role_department" ADD CONSTRAINT "system_role_department_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "system_department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_position_trans" ADD CONSTRAINT "system_position_trans_position_id_fkey" FOREIGN KEY ("position_id") REFERENCES "system_position"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_user_position" ADD CONSTRAINT "system_user_position_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "system_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_user_position" ADD CONSTRAINT "system_user_position_position_id_fkey" FOREIGN KEY ("position_id") REFERENCES "system_position"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_setting" ADD CONSTRAINT "system_setting_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "system_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_setting_trans" ADD CONSTRAINT "system_setting_trans_setting_id_fkey" FOREIGN KEY ("setting_id") REFERENCES "system_setting"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_dictionary_trans" ADD CONSTRAINT "system_dictionary_trans_dictionary_id_fkey" FOREIGN KEY ("dictionary_id") REFERENCES "system_dictionary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_dictionary_item" ADD CONSTRAINT "system_dictionary_item_dictionary_id_fkey" FOREIGN KEY ("dictionary_id") REFERENCES "system_dictionary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_dictionary_item_trans" ADD CONSTRAINT "system_dictionary_item_trans_dictionary_Item_id_fkey" FOREIGN KEY ("dictionary_Item_id") REFERENCES "system_dictionary_item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_notification" ADD CONSTRAINT "system_notification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "system_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_notification_trans" ADD CONSTRAINT "system_notification_trans_notification_id_fkey" FOREIGN KEY ("notification_id") REFERENCES "system_notification"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_user_traffic" ADD CONSTRAINT "system_user_traffic_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "system_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_user_traffic_record" ADD CONSTRAINT "system_user_traffic_record_user_traffic_id_fkey" FOREIGN KEY ("user_traffic_id") REFERENCES "system_user_traffic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_login_log" ADD CONSTRAINT "system_login_log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "system_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_operation_log" ADD CONSTRAINT "system_operation_log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "system_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
