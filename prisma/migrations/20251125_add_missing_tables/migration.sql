-- CreateEnum (if not exists)
DO $$ BEGIN
    CREATE TYPE "BlockType" AS ENUM ('RECURRING', 'ONE_TIME');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- CreateTable
CREATE TABLE IF NOT EXISTS "Settings" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "DynamicPage" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "bannerImage" TEXT,
    "content" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DynamicPage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "BlockedSlot" (
    "id" TEXT NOT NULL,
    "dayOfWeek" INTEGER,
    "timeSlot" TEXT NOT NULL,
    "specificDate" TIMESTAMP(3),
    "blockType" "BlockType" NOT NULL,
    "reason" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT NOT NULL,

    CONSTRAINT "BlockedSlot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex (if not exists)
CREATE UNIQUE INDEX IF NOT EXISTS "Settings_key_key" ON "Settings"("key");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "DynamicPage_slug_key" ON "DynamicPage"("slug");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "DynamicPage_slug_idx" ON "DynamicPage"("slug");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "BlockedSlot_dayOfWeek_timeSlot_isActive_idx" ON "BlockedSlot"("dayOfWeek", "timeSlot", "isActive");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "BlockedSlot_specificDate_timeSlot_isActive_idx" ON "BlockedSlot"("specificDate", "timeSlot", "isActive");

-- AlterTable: Add missing endereco field to Appointment
ALTER TABLE "Appointment" ADD COLUMN IF NOT EXISTS "endereco" TEXT;
