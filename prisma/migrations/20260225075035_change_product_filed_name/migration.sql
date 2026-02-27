/*
  Warnings:

  - You are about to drop the column `basePrice` on the `products` table. All the data in the column will be lost.
  - Added the required column `priceRange` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "products" DROP COLUMN "basePrice",
ADD COLUMN     "priceRange" DECIMAL(10,2) NOT NULL;
