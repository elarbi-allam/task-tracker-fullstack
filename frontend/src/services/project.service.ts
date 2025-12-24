import api from './api';
import { Project, CreateProjectRequest, UpdateProjectRequest, Page } from '@/types';

export const projectService = {
  async getAll(page: number = 0, size: number = 6): Promise<Page<Project>> {
    const response = await api.get<Page<Project>>('/projects', {
      params: { page, size },
    });
    return response.data;
  },

  async getById(id: number): Promise<Project> {
    const response = await api.get<Project>(`/projects/${id}`);
    return response.data;
  },

  async create(data: CreateProjectRequest): Promise<Project> {
    const response = await api.post<Project>('/projects', data);
    return response.data;
  },

  async update(id: number, data: UpdateProjectRequest): Promise<Project> {
    const response = await api.put<Project>(`/projects/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/projects/${id}`);
  },
};
