import api from './api';
import { Task, CreateTaskRequest, UpdateTaskRequest, Page, TaskStatus } from '@/types';

export const taskService = {
  async getByProject(
    projectId: number,
    page: number = 0,
    size: number = 5,
    status?: TaskStatus
  ): Promise<Page<Task>> {
    const response = await api.get<Page<Task>>(`/tasks/project/${projectId}`, {
      params: { page, size, ...(status && { status }) },
    });
    return response.data;
  },

  async create(projectId: number, data: CreateTaskRequest): Promise<Task> {
    const response = await api.post<Task>(`/tasks/project/${projectId}`, data);
    return response.data;
  },

  async update(taskId: number, data: UpdateTaskRequest): Promise<Task> {
    const response = await api.patch<Task>(`/tasks/${taskId}`, data);
    return response.data;
  },

  async delete(taskId: number): Promise<void> {
    await api.delete(`/tasks/${taskId}`);
  },
};
