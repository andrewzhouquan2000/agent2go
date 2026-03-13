#!/bin/bash
# ===========================================
# Agent2Go Database Migration Script
# ===========================================
# This script handles database migration from SQLite to PostgreSQL
# Usage: ./prisma/migrate-to-postgres.sh

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}Agent2Go Database Migration Script${NC}"
echo -e "${GREEN}============================================${NC}"

# Check if .env.production.local exists
if [ ! -f ".env.production.local" ]; then
    echo -e "${RED}Error: .env.production.local not found${NC}"
    echo "Please create it from .env.production template"
    exit 1
fi

# Load environment variables
source .env.production.local

# Step 1: Backup SQLite database
echo -e "\n${YELLOW}Step 1: Backing up SQLite database...${NC}"
BACKUP_FILE="prisma/dev-backup-$(date +%Y%m%d-%H%M%S).db"
cp prisma/dev.db "$BACKUP_FILE"
echo -e "${GREEN}✓ Backup created: $BACKUP_FILE${NC}"

# Step 2: Export data from SQLite
echo -e "\n${YELLOW}Step 2: Exporting data from SQLite...${NC}"
sqlite3 prisma/dev.db ".dump" > prisma/sqlite-export.sql
echo -e "${GREEN}✓ Data exported to prisma/sqlite-export.sql${NC}"

# Step 3: Generate Prisma Client for PostgreSQL
echo -e "\n${YELLOW}Step 3: Generating Prisma Client for PostgreSQL...${NC}"
cp prisma/schema.postgresql.prisma prisma/schema.prisma
npx prisma generate
echo -e "${GREEN}✓ Prisma Client generated${NC}"

# Step 4: Create initial migration
echo -e "\n${YELLOW}Step 4: Creating initial migration...${NC}"
npx prisma migrate dev --name init --create-only
echo -e "${GREEN}✓ Migration created${NC}"

# Step 5: Deploy migration to production
echo -e "\n${YELLOW}Step 5: Deploying migration to production...${NC}"
npx prisma migrate deploy
echo -e "${GREEN}✓ Migration deployed${NC}"

# Step 6: Seed database (optional)
echo -e "\n${YELLOW}Step 6: Seeding database...${NC}"
if [ -f "prisma/seed.ts" ]; then
    npx prisma db seed
    echo -e "${GREEN}✓ Database seeded${NC}"
else
    echo -e "${YELLOW}⚠ No seed file found, skipping...${NC}"
fi

# Step 7: Verify migration
echo -e "\n${YELLOW}Step 7: Verifying migration...${NC}"
npx prisma db execute --stdin <<EOF
SELECT COUNT(*) as user_count FROM "User";
SELECT COUNT(*) as agent_count FROM "Agent";
SELECT COUNT(*) as task_count FROM "Task";
EOF
echo -e "${GREEN}✓ Migration verified${NC}"

# Step 8: Update schema back to SQLite for development (optional)
echo -e "\n${YELLOW}Step 8: Restoring SQLite schema for development...${NC}"
cat > prisma/schema.prisma <<EOF
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  passwordHash  String?
  emailVerified DateTime?
  image         String?
  teams         Team[]
  tasks         Task[]
  accounts      Account[]
  sessions      Session[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Agent {
  id          String   @id @default(cuid())
  name        String   @unique  // CEO, Researcher, Coder
  displayName String
  description String
  capabilities String  // JSON string array
  avatar      String?
  teams       TeamAgent[]
  tasks       Task[]
}

model Team {
  id        String      @id @default(cuid())
  name      String
  userId    String
  user      User        @relation(fields: [userId], references: [id])
  agents    TeamAgent[]
  tasks     Task[]
  createdAt DateTime    @default(now())
}

model TeamAgent {
  id        String @id @default(cuid())
  teamId    String
  agentId   String
  team      Team   @relation(fields: [teamId], references: [id])
  agent     Agent  @relation(fields: [agentId], references: [id])
  role      String // leader, member
}

model Task {
  id          String   @id @default(cuid())
  title       String
  description String
  status      String   // pending, in_progress, completed, failed
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  teamId      String?
  team        Team?    @relation(fields: [teamId], references: [id])
  agentId     String?
  agent       Agent?   @relation(fields: [agentId], references: [id])
  result      String?
  logs        String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}
EOF
npx prisma generate
echo -e "${GREEN}✓ Development schema restored${NC}"

echo -e "\n${GREEN}============================================${NC}"
echo -e "${GREEN}Migration completed successfully!${NC}"
echo -e "${GREEN}============================================${NC}"
echo -e "\n${YELLOW}Next steps:${NC}"
echo "1. Update DATABASE_URL in .env.production.local"
echo "2. Run: npx prisma migrate deploy --schema prisma/schema.postgresql.prisma"
echo "3. Test the application with PostgreSQL"
echo ""
