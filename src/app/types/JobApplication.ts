import type { ApplicationStatus } from './ApplicationStatus';
import type { EmploymentType } from './EmploymentType';

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
