-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "guestPin" TEXT,
ADD COLUMN     "isPasswordProtected" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "viewCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Photo" ADD COLUMN     "downloadCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "image" TEXT,
ADD COLUMN     "name" TEXT;
