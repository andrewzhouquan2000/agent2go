import { NextRequest, NextResponse } from 'next/server';
import { listScenarios, getScenario } from '@/lib/scenario-mapping';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    
    if (id) {
      // Get single scenario
      const scenario = getScenario(id);
      if (!scenario) {
        return NextResponse.json(
          { error: 'Scenario not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(scenario);
    }
    
    // List all scenarios
    const scenarios = listScenarios();
    return NextResponse.json({ scenarios });
  } catch (error) {
    console.error('Error in scenarios API:', error);
    return NextResponse.json(
      { error: 'Failed to load scenarios' },
      { status: 500 }
    );
  }
}
