import { NextResponse } from 'next/server';

/**
 * Health Check API Endpoint
 * 
 * This endpoint is used for:
 * - Load balancer health checks
 * - Deployment verification
 * - Monitoring system status
 * 
 * Returns 200 OK if all systems are healthy
 * Returns 503 Service Unavailable if any system is unhealthy
 */

export async function GET() {
  const startTime = Date.now();
  
  try {
    // Check database connection
    let databaseHealthy = false;
    try {
      const { PrismaClient } = await import('@prisma/client');
      const prisma = new PrismaClient();
      await prisma.$queryRaw`SELECT 1`;
      await prisma.$disconnect();
      databaseHealthy = true;
    } catch (error) {
      console.error('Database health check failed:', error);
    }

    // Check environment variables
    const requiredEnvVars = [
      'DATABASE_URL',
      'NEXTAUTH_SECRET',
      'NEXTAUTH_URL',
    ];
    
    const missingEnvVars = requiredEnvVars.filter(
      (varName) => !process.env[varName]
    );
    
    const envHealthy = missingEnvVars.length === 0;

    // Calculate response time
    const responseTime = Date.now() - startTime;

    // Determine overall health status
    const isHealthy = databaseHealthy && envHealthy;

    const healthStatus: Record<string, any> = {
      status: isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      responseTime: `${responseTime}ms`,
      checks: {
        database: databaseHealthy ? 'ok' : 'failed',
        environment: envHealthy ? 'ok' : 'failed',
      },
      version: process.env.npm_package_version || 'unknown',
      nodeVersion: process.version,
    };

    if (!missingEnvVars.length) {
      healthStatus.env = {
        nodeEnv: process.env.NODE_ENV,
        appUrl: process.env.NEXT_PUBLIC_APP_URL,
      };
    }

    return NextResponse.json(healthStatus, {
      status: isHealthy ? 200 : 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Response-Time': `${responseTime}ms`,
      },
    });
  } catch (error) {
    console.error('Health check failed:', error);
    
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      {
        status: 503,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      }
    );
  }
}
