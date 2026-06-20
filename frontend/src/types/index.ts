export interface Skill {
  id: number;
  name: string;
  category: string;
  proficiencyLevel: string;
}

export interface Experience {
  id: number;
  company: string;
  role: string;
  startDate: string;
  endDate: string | null;
  description: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  technologies: string[];
  githubUrl: string;
  liveUrl: string;
  imageUrl: string;
}

export interface ContactMessage {
  id?: number;
  name: string;
  email: string;
  message: string;
  sentAt?: string;
}
