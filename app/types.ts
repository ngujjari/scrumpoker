export interface TeamMember {
  id: number;
  name: string;
  isAdmin: boolean;
}

export interface Team {
  id: string;
  name: string;
  members: TeamMember[];
}

export interface StoryPoint {
  teamId: string;
  userId: number;
  points: number;
  timestamp: number;
}

export interface StoryPointsState {
  revealed: boolean;
  points: StoryPoint[];
}

declare global {
  interface Window {
    storyPointsSSE?: EventSource;
  }
}