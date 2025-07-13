import { NextRequest, NextResponse } from 'next/server';

// Mock president data - this would come from a database in a real app
const presidents: Record<string, any> = {
  '1': {
    id: '1',
    name: 'Sarah Chen',
    bio: 'Event planning specialist with 5+ years organizing group activities and corporate events.',
    description: 'Sarah is a passionate event organizer who believes that great memories are made when people come together. With her background in hospitality management and a natural talent for bringing people together, she has successfully organized over 200 group events ranging from intimate dinner parties to large-scale outdoor adventures.\n\nHer approach combines meticulous planning with spontaneous fun, ensuring every event she organizes becomes a memorable experience. Sarah specializes in budget-friendly activities that maximize enjoyment while keeping costs reasonable for everyone involved.',
    hourlyRate: 25,
    rating: 4.8,
    reviewCount: 127,
    skills: ['Event Planning', 'Group Coordination', 'Budget Management', 'Outdoor Activities', 'Team Building'],
    avatar: '/images/president1.jpg',
    availability: 'Available',
    portfolio: [
      'Organized monthly hiking trips for 15-person group (2 years)',
      'Coordinated weekly game nights for college alumni network',
      'Planned successful weekend camping trips with 25+ participants',
      'Managed budget and logistics for annual group vacation to Costa Rica'
    ],
    testimonials: [
      {
        id: '1',
        name: 'Mike Rodriguez',
        rating: 5,
        comment: 'Sarah made our group adventures so much more organized and fun! She thinks of everything.',
        date: '2024-11-15'
      },
      {
        id: '2',
        name: 'Jessica Liu',
        rating: 5,
        comment: 'Best decision we made was hiring Sarah. Our events went from chaotic to amazing.',
        date: '2024-10-22'
      },
      {
        id: '3',
        name: 'Alex Thompson',
        rating: 4,
        comment: 'Great organizer, always on budget and super reliable. Highly recommend!',
        date: '2024-09-30'
      }
    ]
  },
  '2': {
    id: '2',
    name: 'Marcus Johnson',
    bio: 'Professional project manager who loves bringing people together through memorable experiences.',
    description: 'Marcus brings his corporate project management expertise to the world of social events. With certifications in PMP and Agile methodologies, he applies proven organizational frameworks to ensure every group activity runs smoothly from conception to completion.\n\nWhat sets Marcus apart is his ability to balance structure with flexibility, creating events that feel spontaneous and fun while being meticulously planned behind the scenes. He excels at managing diverse groups and finding activities that appeal to everyone.',
    hourlyRate: 30,
    rating: 4.9,
    reviewCount: 203,
    skills: ['Project Management', 'Team Building', 'Social Events', 'Conflict Resolution', 'Timeline Management'],
    avatar: '/images/president2.jpg',
    availability: 'Available',
    portfolio: [
      'Led project management for 50-person company retreat',
      'Organized quarterly team building events for tech startup (3 years)',
      'Coordinated multi-city bachelor party with 12 participants',
      'Managed logistics for annual charity fundraiser with 100+ attendees'
    ],
    testimonials: [
      {
        id: '1',
        name: 'Sarah Kim',
        rating: 5,
        comment: 'Marcus is incredibly professional and detail-oriented. Our events run like clockwork!',
        date: '2024-12-01'
      },
      {
        id: '2',
        name: 'David Chen',
        rating: 5,
        comment: 'He made organizing our friend group so much easier. Worth every penny!',
        date: '2024-11-18'
      }
    ]
  },
  '3': {
    id: '3',
    name: 'Emma Rodriguez',
    bio: 'Creative organizer specializing in outdoor adventures and unique group experiences.',
    description: 'Emma is an adventure enthusiast who turned her passion for outdoor activities into a career helping others explore the world around them. With certifications in wilderness first aid and outdoor leadership, she specializes in creating safe, exciting, and memorable outdoor experiences.\n\nHer creative approach to event planning means no two activities are ever the same. Emma loves finding hidden gems and unique experiences that groups will talk about for years to come.',
    hourlyRate: 28,
    rating: 4.7,
    reviewCount: 89,
    skills: ['Outdoor Events', 'Adventure Planning', 'Creative Activities', 'Wilderness Safety', 'Photography'],
    avatar: '/images/president3.jpg',
    availability: 'Busy',
    portfolio: [
      'Guided weekend backpacking trips for 8-person group',
      'Organized unique urban scavenger hunts with photo challenges',
      'Planned creative workshop series (pottery, cooking, art)',
      'Led nature photography expeditions to national parks'
    ],
    testimonials: [
      {
        id: '1',
        name: 'Tyler Jones',
        rating: 5,
        comment: 'Emma introduced us to activities we never would have tried. Amazing experiences!',
        date: '2024-10-15'
      },
      {
        id: '2',
        name: 'Rachel Green',
        rating: 4,
        comment: 'Creative and fun! She always finds the coolest places and activities.',
        date: '2024-09-20'
      }
    ]
  }
};

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const presidentId = params.id;
    const president = presidents[presidentId];

    if (!president) {
      return NextResponse.json(
        { success: false, error: 'President not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: president
    });
  } catch (error) {
    console.error('Error fetching president:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch president' },
      { status: 500 }
    );
  }
}
