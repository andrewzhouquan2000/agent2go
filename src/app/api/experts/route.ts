import { NextRequest, NextResponse } from 'next/server';
import { listAllExperts, loadExpert, getExpertsByCategory } from '@/lib/expert-loader';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const name = searchParams.get('name');
    
    if (name) {
      // Get single expert by name
      const expert = loadExpert(name);
      if (!expert) {
        return NextResponse.json(
          { error: 'Expert not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(expert);
    }
    
    if (category) {
      // Get experts by category
      const experts = getExpertsByCategory(category);
      return NextResponse.json({ experts });
    }
    
    // List all experts (limit to 50 for performance)
    const allExperts = listAllExperts();
    const experts = allExperts.slice(0, 50).map(name => {
      const expert = loadExpert(name);
      return expert ? {
        name: expert.name,
        identity: expert.identity,
      } : null;
    }).filter((e): e is { name: string; identity: string } => e !== null);
    
    return NextResponse.json({ 
      experts,
      total: allExperts.length,
      hasMore: allExperts.length > 50,
    });
  } catch (error) {
    console.error('Error in experts API:', error);
    return NextResponse.json(
      { error: 'Failed to load experts' },
      { status: 500 }
    );
  }
}
