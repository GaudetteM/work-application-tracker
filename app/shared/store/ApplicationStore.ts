import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type {
  ApplicationEvent,
  ApplicationStatus,
  JobApplication,
} from '../types';
import { generateMockApplications } from '../utils/mockData';

type ApplicationStore = {
  applications: JobApplication[];
  events: ApplicationEvent[];

  addApplication: (application: JobApplication) => void;
  updateApplication: (application: JobApplication) => void;
  saveApplication: (
    application: JobApplication,
    previousStatus: ApplicationStatus,
  ) => void;
  changeStatus: (applicationId: string, status: ApplicationStatus) => void;
  deleteApplication: (applicationId: string) => void;
  loadMockData: () => void;
};

export const useApplicationStore = create<ApplicationStore>()(
  persist(
    set => ({
      applications: [],
      events: [],

      addApplication: application =>
        set(state => ({
          applications: [application, ...state.applications],

          events: [
            ...state.events,
            {
              id: `${Date.now()}-event`,
              applicationId: application.id,
              status: application.status,
              createdAt: application.appliedAt ?? '',
            },
          ],
        })),

      updateApplication: application =>
        set(state => ({
          applications: state.applications.map(item =>
            item.id === application.id ? application : item,
          ),
        })),

      changeStatus: (applicationId, status) =>
        set(state => {
          const now = new Date().toISOString();

          return {
            applications: state.applications.map(application =>
              application.id === applicationId
                ? {
                    ...application,
                    status,
                    updatedAt: now,
                  }
                : application,
            ),

            events: [
              ...state.events,
              {
                id: `${Date.now()}-event`,
                applicationId,
                status,
                createdAt: now,
              },
            ],
          };
        }),
      saveApplication: (application, previousStatus) =>
        set(state => {
          const statusChanged = application.status !== previousStatus;
          const now = new Date().toISOString();

          return {
            applications: state.applications.map(item =>
              item.id === application.id
                ? {
                    ...application,
                    updatedAt: now,
                  }
                : item,
            ),
            events: statusChanged
              ? [
                  ...state.events,
                  {
                    id: `${Date.now()}-event`,
                    applicationId: application.id,
                    status: application.status,
                    createdAt: now,
                  },
                ]
              : state.events,
          };
        }),

      deleteApplication: applicationId =>
        set(state => ({
          applications: state.applications.filter(
            application => application.id !== applicationId,
          ),
          events: state.events.filter(
            event => event.applicationId !== applicationId,
          ),
        })),

      loadMockData: () =>
        set(state => {
          const mock = generateMockApplications();

          return {
            applications: [...mock.applications, ...state.applications],
            events: [...mock.events, ...state.events],
          };
        }),
    }),
    {
      name: 'work-application-tracker',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
