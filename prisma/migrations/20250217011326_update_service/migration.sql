/*
  Warnings:

  - Added the required column `service` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Service" AS ENUM ('SANTANDER');

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "service" "Service" NOT NULL;
