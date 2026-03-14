// Prisma singleton for Next.js - prevents multiple instances in development
// IMPORTANT: This is lazy-loaded to avoid build-time initialization errors

import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  getPrisma: () => PrismaClient | undefined
  setPrisma: (client: PrismaClient) => void
}

let prismaInstance: PrismaClient | undefined

function getOrCreatePrisma(): PrismaClient {
  if (!prismaInstance) {
    prismaInstance = new PrismaClient({
      // Only log in development, not in production builds
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    })
  }
  return prismaInstance
}

// Export a getter function instead of direct instance
// This prevents build-time initialization
export const getPrisma = (): PrismaClient => {
  if (process.env.NODE_ENV === 'production') {
    return getOrCreatePrisma()
  }
  
  // In development, use global singleton
  let prisma = globalForPrisma.getPrisma?.()
  if (!prisma) {
    prisma = getOrCreatePrisma()
    globalForPrisma.setPrisma = (client) => {
      prismaInstance = client
    }
    globalForPrisma.getPrisma = () => prismaInstance
  }
  return prisma
}

export default getPrisma
