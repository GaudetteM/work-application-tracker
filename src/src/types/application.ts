export type EmploymentType = 'full_time' | 'contract' | 'part_time';

export type ApplicationStatus =
  | 'applied'
  | 'recruiter_contact'
  | 'interview'
  | 'offer'
  | 'rejected'
  | 'withdrawn'
  | 'closed';

export type JobApplication = {
  id: string;
  title: string;
  company: string;
  employmentType: EmploymentType;
  location?: string;
  salaryMin?: number;
  salaryMax?: number;
  listingUrl?: string;
  listingSource: string;
  applicationSource: string;
  appliedAt: string;
  status: ApplicationStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};
