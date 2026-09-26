export type EmploymentType = 'full_time' | 'contract' | 'part_time';

export type ApplicationStatus =
  | 'applied'
  | 'recruiter_contact'
  | 'interview'
  | 'offer'
  | 'rejected'
  | 'withdrawn'
  | 'closed';

export interface JobApplication {
  id: string;
  title: string;
  company: string;
  employmentType: EmploymentType;
  location?: string;
  salary?: string;
  listingUrl?: string;
  listingSource: string;
  applicationSource: string;
  appliedAt: string;
  status: ApplicationStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationEvent {
  id: string;
  applicationId: string;
  status: ApplicationStatus;
  createdAt: string;
  note?: string;
}
