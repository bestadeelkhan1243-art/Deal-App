import { create } from 'zustand';

export interface AnalyticsData {
  views: {
    total: number;
    trend: string;
    history: number[]; // Weekly or daily history
  };
  likes: {
    total: number;
    trend: string;
    history: number[];
  };
  followers: {
    total: number;
    trend: string;
    history: number[];
  };
  customerDemographics: {
    ageGroups: { label: string; value: number }[];
    activeVsInactive: { active: number; inactive: number };
  };
}

interface AnalyticsState {
  data: AnalyticsData;
}

const mockAnalyticsData: AnalyticsData = {
  views: {
    total: 2240,
    trend: '+12%',
    history: [120, 180, 240, 310, 400, 480, 510], // Last 7 days
  },
  likes: {
    total: 845,
    trend: '+8%',
    history: [45, 60, 85, 110, 140, 190, 215],
  },
  followers: {
    total: 1250,
    trend: '+15%',
    history: [1100, 1120, 1150, 1180, 1200, 1220, 1250],
  },
  customerDemographics: {
    ageGroups: [
      { label: '18-24', value: 30 },
      { label: '25-34', value: 45 },
      { label: '35-44', value: 15 },
      { label: '45+', value: 10 },
    ],
    activeVsInactive: { active: 65, inactive: 35 },
  }
};

export const useAnalyticsStore = create<AnalyticsState>(() => ({
  data: mockAnalyticsData,
}));
