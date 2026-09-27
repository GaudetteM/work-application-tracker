import type { ApplicationStatus, JobApplication } from '../types';

export function formatStatus(status: ApplicationStatus): string {
  switch (status) {
    case 'recruiter_contact':
      return 'Recruiter Contact';

    case 'interview':
      return 'Interview';

    case 'offer':
      return 'Offer';

    case 'rejected':
      return 'Rejected';

    case 'withdrawn':
      return 'Withdrawn';

    case 'closed':
      return 'Closed';

    case 'applied':
    default:
      return 'Applied';
  }
}

export function getStatusCounts(
  applications: JobApplication[],
): Record<ApplicationStatus, number> {
  return applications.reduce(
    (counts, application) => {
      counts[application.status] += 1;
      return counts;
    },
    {
      applied: 0,
      recruiter_contact: 0,
      interview: 0,
      offer: 0,
      rejected: 0,
      withdrawn: 0,
      closed: 0,
    } satisfies Record<ApplicationStatus, number>,
  );
}
