import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { scenario, userInput } = body;
    
    if (!scenario || !userInput) {
      return NextResponse.json(
        { error: 'Missing scenario or userInput' },
        { status: 400 }
      );
    }
    
    // Path to Python script
    const pythonScript = join(process.cwd(), 'python/src/crew_runner.py');
    // Use system python or from PATH (venv will be activated separately)
    const pythonVenv = process.env.PYTHON_PATH || 'python3';
    
    console.log(`Executing CrewAI scenario: ${scenario}`);
    
    // Create a session ID for this execution
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    
    // Spawn Python process
    const pythonProcess = spawn(pythonVenv, [pythonScript, scenario, userInput], {
      env: { ...process.env, PYTHONPATH: join(process.cwd(), 'python/src') },
    });
    
    let stdout = '';
    let stderr = '';
    const logs: Array<{ type: string; data: string; timestamp: number }> = [];
    
    pythonProcess.stdout.on('data', (data) => {
      const text = data.toString();
      stdout += text;
      logs.push({
        type: 'output',
        data: text,
        timestamp: Date.now(),
      });
    });
    
    pythonProcess.stderr.on('data', (data) => {
      const text = data.toString();
      stderr += text;
      logs.push({
        type: 'error',
        data: text,
        timestamp: Date.now(),
      });
    });
    
    // Wait for process to complete with timeout
    const timeout = 5 * 60 * 1000; // 5 minutes
    const result = await Promise.race([
      new Promise<{ code: number | null }>((resolve) => {
        pythonProcess.on('close', (code) => {
          resolve({ code });
        });
      }),
      new Promise<{ code: number | null }>((resolve) => {
        setTimeout(() => {
          pythonProcess.kill();
          resolve({ code: -1 });
        }, timeout);
      }),
    ]);
    
    if (result.code === -1) {
      return NextResponse.json(
        { error: 'Execution timeout (5 minutes)', sessionId, logs },
        { status: 504 }
      );
    }
    
    if (result.code !== 0) {
      console.error('Python process error:', stderr);
      return NextResponse.json(
        { error: 'Execution failed', details: stderr, sessionId, logs },
        { status: 500 }
      );
    }
    
    // Parse JSON output
    let output;
    try {
      output = JSON.parse(stdout);
    } catch (e) {
      console.error('Failed to parse Python output:', stdout);
      return NextResponse.json(
        { error: 'Invalid output from Python script', sessionId, rawOutput: stdout },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      ...output,
      sessionId,
      success: true,
    });
  } catch (error) {
    console.error('Error in crew execute API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}
