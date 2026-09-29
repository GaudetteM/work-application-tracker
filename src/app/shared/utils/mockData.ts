import type {
  ApplicationEvent,
  ApplicationStatus,
  EmploymentType,
  JobApplication,
} from '../types';

const TITLES = [
  'Senior Software Engineer',
  'Frontend Developer',
  'Backend Engineer',
  'Full Stack Developer',
  'Mobile Engineer',
  'Product Engineer',
  'DevOps Engineer',
  'Data Engineer',
  'Engineering Manager',
  'QA Engineer',
  'Platform Engineer',
  'Staff Software Engineer',
  'Software Engineer II',
  'React Native Developer',
  'Solutions Engineer',
];

const COMPANIES = [
  'Northwind Labs',
  'Bluepeak Systems',
  'Harborlight Tech',
  'Vertex Analytics',
  'Cascade Softworks',
  'Ironwood Digital',
  'Meridian Apps',
  'Silverline Cloud',
  'Fieldstone Robotics',
  'Lumen Data Co',
  'Anchor Studios',
  'Redwood Interactive',
  'Brightpath AI',
  'Summit Networks',
  'Clearwater Payments',
];

const LOCATIONS = [
  'Remote',
  'Minneapolis, MN',
  'Chicago, IL',
  'Austin, TX',
  'Seattle, WA',
  'New York, NY',
  undefined,
];

const LISTING_SOURCES = [
  'LinkedIn',
  'Indeed',
  'Glassdoor',
  'Company Website',
  'Referral',
  'Recruiter',
];

const APPLICATION_SOURCES = [
  'Company Website',
  'LinkedIn',
  'Indeed',
  'Recruiter',
  'Email',
  'Referral',
];

const EMPLOYMENT_TYPES: EmploymentType[] = ['full_time', 'contract', 'part_time'];

// Roughly weighted so most mock applications land on realistic, earlier-stage statuses.
const STATUSES: ApplicationStatus[] = [
  'interested',
  'applied',
  'applied',
  'applied',
  'recruiter_contact',
  'interview',
  'interview',
  'offer',
  'rejected',
  'rejected',
  'withdrawn',
];

function pick<T>(items: T[], random: () => number): T {
  return items[Math.floor(random() * items.length)];
}

// Deterministic per-application PRNG (Park-Miller LCG) so each field draws an
// independent, evenly distributed value instead of correlating via a shared seed.
function createRandom(seed: number): () => number {
  let state = seed % 2147483647;

  if (state <= 0) {
    state += 2147483646;
  }

  return function random() {
    state = (state * 16807) % 2147483647;
    return (state - 1) / 2147483646;
  };
}

/**
 * Generates a batch of mock applications (and matching activity events) dated
 * across the past two weeks, useful for quickly populating the store for testing.
 */
export function generateMockApplications(count = 15): {
  applications: JobApplication[];
  events: ApplicationEvent[];
} {
  const now = Date.now();
  const twoWeeksMs = 14 * 24 * 60 * 60 * 1000;

  const applications: JobApplication[] = [];
  const events: ApplicationEvent[] = [];

  for (let i = 0; i < count; i += 1) {
    const seed = i + 1;
    const random = createRandom(seed * 104729);
    const status = pick(STATUSES, random);
    const employmentType = pick(EMPLOYMENT_TYPES, random);

    const createdAtMs = now - Math.round((seed / count) * twoWeeksMs);
    const createdAt = new Date(createdAtMs).toISOString();
    const appliedAt = status === 'interested' ? undefined : createdAt;

    const id = `mock-${createdAtMs}-${seed}`;

    applications.push({
      id,
      title: pick(TITLES, random),
      company: pick(COMPANIES, random),
      employmentType,
      location: pick(LOCATIONS, random),
      salary:
        random() < 0.7
          ? `$${100 + Math.floor(random() * 6) * 10}k–$${140 + Math.floor(random() * 6) * 10}k`
          : undefined,
      listingSource: pick(LISTING_SOURCES, random),
      applicationSource: pick(APPLICATION_SOURCES, random),
      status,
      appliedAt,
      notes: undefined,
      createdAt,
      updatedAt: createdAt,
    });

    events.push({
      id: `${id}-event`,
      applicationId: id,
      status,
      createdAt,
    });
  }

  return { applications, events };
}
