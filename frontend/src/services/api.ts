import axios from 'axios';
import type { Project, Skill, Experience, ContactMessage } from '../types';

const api = axios.create({
  baseURL: '', // Let Vite proxy handle prefix routing
});

export const getProjects = async (): Promise<Project[]> => {
  const response = await api.get<Project[]>('/api/projects');
  return response.data;
};

export const getSkills = async (): Promise<Skill[]> => {
  const response = await api.get<Skill[]>('/api/skills');
  return response.data;
};

export const getExperiences = async (): Promise<Experience[]> => {
  const response = await api.get<Experience[]>('/api/experiences');
  return response.data;
};

export const sendContactMessage = async (message: ContactMessage): Promise<ContactMessage> => {
  const response = await api.post<ContactMessage>('/api/contact', message);
  return response.data;
};
