import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import path from 'node:path'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Prisma 7.x: Use PrismaLibSql with config object
const databaseURL = process.env.DATABASE_URL 
  ? process.env.DATABASE_URL 
  : `file:${path.join(process.cwd(), 'prisma', 'dev.db')}`

const adapter = new PrismaLibSql({
  url: databaseURL,
})

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
