import path from 'node:path'
import { defineConfig } from '@prisma/config'
import { PrismaLibSql } from '@prisma/adapter-libsql'

const databaseURL = process.env.DATABASE_URL 
  ? process.env.DATABASE_URL 
  : `file:${path.join(process.cwd(), 'prisma', 'dev.db')}`

export default defineConfig({
  datasource: {
    url: databaseURL,
  },
})
