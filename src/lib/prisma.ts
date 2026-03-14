// Prisma singleton for Next.js - prevents multiple instances in development
import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import path from 'path'

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient
}

export function getPrisma(): PrismaClient {
  if (!globalForPrisma.prisma) {
    const dbUrl = process.env.DATABASE_URL || `file:${path.join(process.cwd(), 'prisma', 'dev.db')}`
    
    // Handle file: URLs - ensure absolute path
    let url = dbUrl
    if (url.startsWith('file:')) {
      const dbPath = url.slice(5)
      if (!dbPath.startsWith('/')) {
        url = `file:${path.join(process.cwd(), dbPath)}`
      }
    }
    
    console.log('[Prisma] Connecting to:', url)
    
    // Pass config directly to PrismaLibSql (not a client instance)
    const adapter = new PrismaLibSql({ url })
    
    globalForPrisma.prisma = new PrismaClient({ 
      adapter,
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    })
  }
  return globalForPrisma.prisma
}

export default getPrisma
