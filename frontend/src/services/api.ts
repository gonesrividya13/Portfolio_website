import axios from 'axios';
import type { Project, Skill, Experience, ContactMessage } from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '', 
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

export const chatWithAvatar = async (message: string): Promise<string> => {
  const response = await api.post<{ response: string }>('/api/chat', { message });
  return response.data.response;
};

export const getLiveChatToken = async (): Promise<{ token: string; systemInstruction: string }> => {
  const response = await api.get<{ token: string; systemInstruction: string }>('/api/chat/live-token');
  return response.data;
};

