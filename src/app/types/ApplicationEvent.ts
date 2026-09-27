import type { ApplicationStatus } from './ApplicationStatus';

export interface ApplicationEvent {
  id: string;
  applicationId: string;
  status: ApplicationStatus;
  createdAt: string;
  note?: string;
}
