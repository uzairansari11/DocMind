export type Participant = { id: string; name: string; role: string; };
export type Segment = { id: string; speaker: string; intent: string; text: string; };
export type Chapter = { id: string; title: string; summary: string; estimatedDurationSeconds: number; segments: Segment[]; };
export type PodcastData = {
  title: string;
  description: string;
  language: string;
  estimatedDurationSeconds: number;
  participants: Participant[];
  chapters: Chapter[];
};
