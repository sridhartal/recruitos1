import { NextRequest, NextResponse } from 'next/server';
import { mockDataService } from '@/services/mockDataService';
import { matchCandidates } from '@/services/candidateMatchingService';
import { JobDescription } from '@/types/job';

// Pre-generated external candidates (simulated web scraping results)
const externalCandidates = [
  {
    id: 'ext-001',
    name: 'Alex Chen',
    email: 'alex.chen@email.com',
    phone: '+1-555-2001',
    skills: ['Python', 'Django', 'PostgreSQL', 'React', 'TypeScript', 'AWS'],
    experience: 6,
    currentRole: 'Senior Full Stack Engineer',
    location: 'Remote',
    status: 'available',
  },
  {
    id: 'ext-002',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1-555-2002',
    skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'GraphQL', 'Docker'],
    experience: 5,
    currentRole: 'Full Stack Developer',
    location: 'New York, NY',
    status: 'available',
  },
  {
    id: 'ext-003',
    name: 'Michael Zhang',
    email: 'michael.zhang@email.com',
    phone: '+1-555-2003',
    skills: ['Python', 'FastAPI', 'PostgreSQL', 'Redis', 'Kubernetes', 'AWS'],
    experience: 7,
    currentRole: 'Senior Backend Engineer',
    location: 'San Francisco, CA',
    status: 'available',
  },
  {
    id: 'ext-004',
    name: 'Lisa Park',
    email: 'lisa.park@email.com',
    phone: '+1-555-2004',
    skills: ['TypeScript', 'React', 'Next.js', 'Tailwind CSS', 'Prisma', 'PostgreSQL'],
    experience: 4,
    currentRole: 'Frontend Engineer',
    location: 'Seattle, WA',
    status: 'available',
  },
  {
    id: 'ext-005',
    name: 'David Kim',
    email: 'david.kim@email.com',
    phone: '+1-555-2005',
    skills: ['Java', 'Spring Boot', 'PostgreSQL', 'Kafka', 'Microservices', 'Docker'],
    experience: 6,
    currentRole: 'Senior Backend Engineer',
    location: 'Austin, TX',
    status: 'available',
  },
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { jobDescription } = body;

    if (!jobDescription) {
      return NextResponse.json(
        { error: 'Job description is required' },
        { status: 400 }
      );
    }

    // Simulate web scraping delay (5 seconds as per requirements)
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // Match external candidates against job description
    const matchedCandidates = matchCandidates(
      externalCandidates as any,
      jobDescription as JobDescription
    );

    // Return top 5 matches
    const topMatches = matchedCandidates.slice(0, 5);

    return NextResponse.json({
      candidates: topMatches,
      total: topMatches.length,
      source: 'external',
    });
  } catch (error) {
    console.error('Error scraping candidates:', error);
    return NextResponse.json(
      { error: 'Failed to scrape candidates' },
      { status: 500 }
    );
  }
}
