import { NextRequest, NextResponse } from 'next/server';

// Mock bundles storage - in a real app, this would be in a database
let bundlesStorage: Record<string, any[]> = {};

export async function GET(
  request: NextRequest,
  { params }: { params: { crewCaptainId: string } }
) {
  try {
    const crewCaptainId = params.crewCaptainId;
    const bundles = bundlesStorage[crewCaptainId] || [];

    return NextResponse.json({
      success: true,
      data: bundles
    });
  } catch (error) {
    console.error('Error fetching bundles:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch bundles' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { crewCaptainId: string } }
) {
  try {
    const crewCaptainId = params.crewCaptainId;
    const body = await request.json();
    const { title, description, price, duration, tags = [], isActive = true } = body;

    // Validation
    if (!title || !description || !price || !duration) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newBundle = {
      id: `bundle_${Date.now()}`,
      title,
      description,
      price: parseFloat(price),
      duration,
      tags: Array.isArray(tags) ? tags : [],
      isActive,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (!bundlesStorage[crewCaptainId]) {
      bundlesStorage[crewCaptainId] = [];
    }

    bundlesStorage[crewCaptainId].push(newBundle);

    return NextResponse.json({
      success: true,
      message: 'Bundle created successfully',
      data: newBundle
    });
  } catch (error) {
    console.error('Error creating bundle:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create bundle' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { crewCaptainId: string } }
) {
  try {
    const crewCaptainId = params.crewCaptainId;
    const body = await request.json();
    const { bundleId, title, description, price, duration, tags = [], isActive = true } = body;

    if (!bundleId) {
      return NextResponse.json(
        { success: false, error: 'Bundle ID is required' },
        { status: 400 }
      );
    }

    if (!bundlesStorage[crewCaptainId]) {
      return NextResponse.json(
        { success: false, error: 'No bundles found for this crew captain' },
        { status: 404 }
      );
    }

    const bundleIndex = bundlesStorage[crewCaptainId].findIndex(
      bundle => bundle.id === bundleId
    );

    if (bundleIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Bundle not found' },
        { status: 404 }
      );
    }

    bundlesStorage[crewCaptainId][bundleIndex] = {
      ...bundlesStorage[crewCaptainId][bundleIndex],
      title,
      description,
      price: parseFloat(price),
      duration,
      tags: Array.isArray(tags) ? tags : [],
      isActive,
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      message: 'Bundle updated successfully',
      data: bundlesStorage[crewCaptainId][bundleIndex]
    });
  } catch (error) {
    console.error('Error updating bundle:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update bundle' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { crewCaptainId: string } }
) {
  try {
    const crewCaptainId = params.crewCaptainId;
    const { searchParams } = new URL(request.url);
    const bundleId = searchParams.get('bundleId');

    if (!bundleId) {
      return NextResponse.json(
        { success: false, error: 'Bundle ID is required' },
        { status: 400 }
      );
    }

    if (!bundlesStorage[crewCaptainId]) {
      return NextResponse.json(
        { success: false, error: 'No bundles found for this crew captain' },
        { status: 404 }
      );
    }

    const bundleIndex = bundlesStorage[crewCaptainId].findIndex(
      bundle => bundle.id === bundleId
    );

    if (bundleIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Bundle not found' },
        { status: 404 }
      );
    }

    bundlesStorage[crewCaptainId].splice(bundleIndex, 1);

    return NextResponse.json({
      success: true,
      message: 'Bundle deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting bundle:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete bundle' },
      { status: 500 }
    );
  }
}
