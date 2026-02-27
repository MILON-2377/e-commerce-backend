/*
  Warnings:

  - You are about to drop the column `level` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `barcode` on the `product_variants` table. All the data in the column will be lost.
  - You are about to drop the column `sku` on the `products` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "products_sku_key";

-- AlterTable
ALTER TABLE "categories" DROP COLUMN "level";

-- AlterTable
ALTER TABLE "product_variants" DROP COLUMN "barcode";

-- AlterTable
ALTER TABLE "products" DROP COLUMN "sku";
