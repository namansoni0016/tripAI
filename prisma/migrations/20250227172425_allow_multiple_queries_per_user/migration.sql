-- DropIndex
DROP INDEX "Query_userId_key";

-- CreateIndex
CREATE INDEX "Query_userId_idx" ON "Query"("userId");
