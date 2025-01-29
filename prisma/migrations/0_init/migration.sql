-- CreateTable
CREATE TABLE "User" (
    "user_id" CHAR(10) NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "password_hash" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Campaign" (
    "campaign_id" CHAR(10) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" VARCHAR(1000) NOT NULL,
    "password" VARCHAR(100),
    "dm_id" CHAR(10) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("campaign_id")
);

-- CreateTable
CREATE TABLE "Character" (
    "character_id" CHAR(10) NOT NULL,
    "campaign_id" CHAR(10) NOT NULL,
    "user_id" CHAR(10) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" VARCHAR(200),
    "character_type" VARCHAR(50) NOT NULL,
    "race" VARCHAR(50),
    "cclass" CHAR(2) NOT NULL DEFAULT 'bb',
    "level" INTEGER NOT NULL DEFAULT 1,
    "background" VARCHAR(100),
    "alignment" VARCHAR(50),
    "portrait_url" VARCHAR(500),
    "strength" INTEGER NOT NULL DEFAULT 0,
    "dexterity" INTEGER NOT NULL DEFAULT 0,
    "constitution" INTEGER NOT NULL DEFAULT 0,
    "intelligence" INTEGER NOT NULL DEFAULT 0,
    "wisdom" INTEGER NOT NULL DEFAULT 0,
    "charisma" INTEGER NOT NULL DEFAULT 0,
    "max_hit_points" INTEGER NOT NULL DEFAULT 0,
    "current_hit_points" INTEGER NOT NULL DEFAULT 0,
    "temp_hit_points" INTEGER NOT NULL DEFAULT 0,
    "load_capacity" INTEGER NOT NULL DEFAULT 0,
    "backpack_capacity" INTEGER NOT NULL DEFAULT 60,
    "armor_class" INTEGER NOT NULL DEFAULT 0,
    "speed" INTEGER NOT NULL DEFAULT 0,
    "inspiration" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Character_pkey" PRIMARY KEY ("character_id")
);

-- CreateTable
CREATE TABLE "CampaignUser" (
    "campaign_user_id" CHAR(10) NOT NULL,
    "campaign_id" CHAR(10) NOT NULL,
    "user_id" CHAR(10) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CampaignUser_pkey" PRIMARY KEY ("campaign_user_id")
);

-- CreateTable
CREATE TABLE "InventoryItem" (
    "item_id" CHAR(10) NOT NULL,
    "character_id" CHAR(10) NOT NULL,
    "i" INTEGER NOT NULL DEFAULT 0,
    "slot" VARCHAR(10) NOT NULL,
    "item_name" VARCHAR(50) NOT NULL,
    "description" VARCHAR(200) NOT NULL,
    "ability" VARCHAR(200) NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "category" VARCHAR(50) NOT NULL,
    "magic" BOOLEAN NOT NULL DEFAULT false,
    "quantity" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "InventoryItem_pkey" PRIMARY KEY ("item_id")
);

-- CreateTable
CREATE TABLE "Currency" (
    "currency_id" CHAR(10) NOT NULL,
    "character_id" CHAR(10) NOT NULL,
    "platin" INTEGER NOT NULL DEFAULT 0,
    "gold" INTEGER NOT NULL DEFAULT 0,
    "silver" INTEGER NOT NULL DEFAULT 0,
    "copper" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Currency_pkey" PRIMARY KEY ("currency_id")
);

-- CreateTable
CREATE TABLE "SpellSlot" (
    "spell_slot_id" CHAR(10) NOT NULL,
    "character_id" CHAR(10) NOT NULL,
    "spell_level" INTEGER NOT NULL DEFAULT 0,
    "total_casts" INTEGER NOT NULL DEFAULT 0,
    "casts_remaining" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "SpellSlot_pkey" PRIMARY KEY ("spell_slot_id")
);

-- CreateTable
CREATE TABLE "CharacterInfo" (
    "character_info_id" CHAR(10) NOT NULL,
    "character_id" CHAR(10) NOT NULL,
    "abilities" VARCHAR(1000),
    "conditions" VARCHAR(1000),
    "notes" VARCHAR(1000),

    CONSTRAINT "CharacterInfo_pkey" PRIMARY KEY ("character_info_id")
);

-- CreateTable
CREATE TABLE "Dashboard" (
    "dashboard_id" CHAR(10) NOT NULL,
    "campaign_id" CHAR(10) NOT NULL,
    "character_id" CHAR(10),
    "visibility" VARCHAR(20) NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Dashboard_pkey" PRIMARY KEY ("dashboard_id")
);

-- CreateTable
CREATE TABLE "DashboardElement" (
    "element_id" CHAR(10) NOT NULL,
    "dashboard_id" CHAR(10) NOT NULL,
    "character_id" CHAR(10) NOT NULL,
    "element_type" VARCHAR(50) NOT NULL,
    "x_lg" INTEGER NOT NULL DEFAULT 0,
    "y_lg" INTEGER NOT NULL DEFAULT 0,
    "w_lg" INTEGER NOT NULL DEFAULT 1,
    "h_lg" INTEGER NOT NULL DEFAULT 1,
    "x_md" INTEGER,
    "y_md" INTEGER,
    "w_md" INTEGER,
    "h_md" INTEGER,
    "x_sm" INTEGER,
    "y_sm" INTEGER,
    "w_sm" INTEGER,
    "h_sm" INTEGER,
    "x_xs" INTEGER,
    "y_xs" INTEGER,
    "w_xs" INTEGER,
    "h_xs" INTEGER,
    "x_xxs" INTEGER,
    "y_xxs" INTEGER,
    "w_xxs" INTEGER,
    "h_xxs" INTEGER,

    CONSTRAINT "DashboardElement_pkey" PRIMARY KEY ("element_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "DashboardElement_dashboard_id_character_id_element_type_key" ON "DashboardElement"("dashboard_id", "character_id", "element_type");

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_dm_id_fkey" FOREIGN KEY ("dm_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "Campaign"("campaign_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignUser" ADD CONSTRAINT "CampaignUser_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "Campaign"("campaign_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignUser" ADD CONSTRAINT "CampaignUser_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryItem" ADD CONSTRAINT "InventoryItem_character_id_fkey" FOREIGN KEY ("character_id") REFERENCES "Character"("character_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Currency" ADD CONSTRAINT "Currency_character_id_fkey" FOREIGN KEY ("character_id") REFERENCES "Character"("character_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpellSlot" ADD CONSTRAINT "SpellSlot_character_id_fkey" FOREIGN KEY ("character_id") REFERENCES "Character"("character_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterInfo" ADD CONSTRAINT "CharacterInfo_character_id_fkey" FOREIGN KEY ("character_id") REFERENCES "Character"("character_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dashboard" ADD CONSTRAINT "Dashboard_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "Campaign"("campaign_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dashboard" ADD CONSTRAINT "Dashboard_character_id_fkey" FOREIGN KEY ("character_id") REFERENCES "Character"("character_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DashboardElement" ADD CONSTRAINT "DashboardElement_dashboard_id_fkey" FOREIGN KEY ("dashboard_id") REFERENCES "Dashboard"("dashboard_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DashboardElement" ADD CONSTRAINT "DashboardElement_character_id_fkey" FOREIGN KEY ("character_id") REFERENCES "Character"("character_id") ON DELETE CASCADE ON UPDATE CASCADE;

