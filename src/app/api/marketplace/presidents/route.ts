import { NextRequest, NextResponse } from 'next/server';

// Mock president data - in a real app, this would come from a database
const presidents = [
  {
    id: '1',
    name: 'Sarah Chen',
    bio: 'Event planning specialist with 5+ years organizing group activities and corporate events.',
    hourlyRate: 25,
    rating: 4.8,
    reviewCount: 127,
    skills: ['Event Planning', 'Group Coordination', 'Budget Management'],
    avatar: '/images/president1.jpg',
    availability: 'Available',
    bundles: [
      {
        id: 'b1-1',
        title: 'Night Out Planning',
        description: 'Complete planning for a perfect night out including restaurant reservations, activity coordination, and group logistics.',
        price: 25,
        duration: '1 evening',
        tags: ['nightlife', 'restaurants', 'quick'],
        isActive: true
      },
      {
        id: 'b1-2',
        title: 'Weekend Adventure Package',
        description: 'Full weekend trip planning with accommodation research, activity booking, and detailed itinerary creation.',
        price: 75,
        duration: '1 weekend',
        tags: ['travel', 'adventure', 'comprehensive'],
        isActive: true
      },
      {
        id: 'b1-3',
        title: 'Monthly Event Series',
        description: 'Plan and coordinate 4 group events throughout the month with themes, venues, and ongoing group engagement.',
        price: 150,
        duration: '1 month',
        tags: ['ongoing', 'series', 'premium'],
        isActive: true
      }
    ]
  },
  {
    id: '2',
    name: 'Marcus Johnson',
    bio: 'Professional project manager who loves bringing people together through memorable experiences.',
    hourlyRate: 30,
    rating: 4.9,
    reviewCount: 203,
    skills: ['Project Management', 'Team Building', 'Social Events'],
    avatar: '/images/president2.jpg',
    availability: 'Available',
    bundles: [
      {
        id: 'b2-1',
        title: 'Team Building Session',
        description: 'Professional team building event with activities designed to strengthen group bonds and communication.',
        price: 100,
        duration: '1 day',
        tags: ['team-building', 'professional', 'structured'],
        isActive: true
      },
      {
        id: 'b2-2',
        title: 'Event Management Complete',
        description: 'End-to-end event management for special occasions including planning, coordination, and execution.',
        price: 200,
        duration: '1 week',
        tags: ['comprehensive', 'special-events', 'premium'],
        isActive: true
      },
      {
        id: 'b2-3',
        title: 'Group Retreat Planning',
        description: 'Complete retreat planning with location scouting, activity planning, and logistics coordination.',
        price: 300,
        duration: '2 weeks',
        tags: ['retreat', 'comprehensive', 'luxury'],
        isActive: false
      }
    ]
  },
  {
    id: '3',
    name: 'Emma Rodriguez',
    bio: 'Creative organizer specializing in outdoor adventures and unique group experiences.',
    hourlyRate: 28,
    rating: 4.7,
    reviewCount: 89,
    skills: ['Outdoor Events', 'Adventure Planning', 'Creative Activities'],
    avatar: '/images/president3.jpg',
    availability: 'Busy',
    bundles: [
      {
        id: 'b3-1',
        title: 'Urban Adventure Hunt',
        description: 'Custom scavenger hunt through the city with unique challenges and photo opportunities.',
        price: 45,
        duration: '1 day',
        tags: ['adventure', 'urban', 'creative'],
        isActive: true
      },
      {
        id: 'b3-2',
        title: 'Outdoor Workshop Series',
        description: 'Three creative outdoor workshops including photography, nature sketching, and outdoor cooking.',
        price: 120,
        duration: '3 days',
        tags: ['workshops', 'creative', 'outdoor'],
        isActive: true
      }
    ]
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.toLowerCase() || '';
    const minRate = searchParams.get('minRate') ? parseInt(searchParams.get('minRate')!) : 0;
    const maxRate = searchParams.get('maxRate') ? parseInt(searchParams.get('maxRate')!) : Infinity;
    const availability = searchParams.get('availability');

    let filteredPresidents = presidents;

    // Apply search filter
    if (search) {
      filteredPresidents = filteredPresidents.filter(president =>
        president.name.toLowerCase().includes(search) ||
        president.bio.toLowerCase().includes(search) ||
        president.skills.some(skill => skill.toLowerCase().includes(search))
      );
    }

    // Apply rate filter
    filteredPresidents = filteredPresidents.filter(president =>
      president.hourlyRate >= minRate && president.hourlyRate <= maxRate
    );

    // Apply availability filter
    if (availability) {
      filteredPresidents = filteredPresidents.filter(president =>
        president.availability.toLowerCase() === availability.toLowerCase()
      );
    }

    return NextResponse.json({
      success: true,
      data: filteredPresidents,
      total: filteredPresidents.length
    });
  } catch (error) {
    console.error('Error fetching presidents:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch presidents' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { presidentId, groupId, message } = body;

    // In a real app, you would:
    // 1. Validate the user is authenticated
    // 2. Validate the group belongs to the user
    // 3. Create a hire request in the database
    // 4. Send notification to the president
    // 5. Send confirmation email to the user

    console.log('Hire request:', { presidentId, groupId, message });

    return NextResponse.json({
      success: true,
      message: 'Hire request sent successfully',
      requestId: `req_${Date.now()}`
    });
  } catch (error) {
    console.error('Error processing hire request:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process hire request' },
      { status: 500 }
    );
  }
}
