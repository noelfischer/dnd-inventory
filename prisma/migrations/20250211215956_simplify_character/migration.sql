/*
  Warnings:

  - You are about to drop the column `alignment` on the `Character` table. All the data in the column will be lost.
  - You are about to drop the column `background` on the `Character` table. All the data in the column will be lost.
  - You are about to drop the column `race` on the `Character` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Character" DROP COLUMN "alignment",
DROP COLUMN "background",
DROP COLUMN "race",
ADD COLUMN     "species" VARCHAR(50),
ALTER COLUMN "cclass" SET DEFAULT 'ar';
